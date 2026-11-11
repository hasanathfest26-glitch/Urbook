-- Urbook Supabase Schema (Postgres 17 + RLS + Storage)
-- Profiles linked 1:1 with auth.users
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default 'Urbook student',
  college text not null default '',
  avatar_url text,
  email_verified boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Course books table
create table if not exists public.books (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  author text not null,
  price integer not null check (price > 0),
  college text not null,
  course text not null,
  condition text not null check (condition in ('Like new', 'Good', 'Well read')),
  description text,
  shade text not null default '#3f6954',
  cover_url text,
  status text not null default 'available' check (status in ('available', 'sold')),
  created_at timestamptz not null default now()
);

-- Direct buyer-to-seller contact requests
create table if not exists public.book_requests (
  id uuid primary key default gen_random_uuid(),
  book_id uuid not null references public.books(id) on delete cascade,
  buyer_id uuid not null references public.profiles(id) on delete cascade,
  seller_id uuid not null references public.profiles(id) on delete cascade,
  message text not null,
  buyer_contact text,
  status text not null default 'sent' check (status in ('sent', 'replied', 'closed')),
  created_at timestamptz not null default now()
);

-- Performance indexes
create index if not exists books_status_created_idx on public.books (status, created_at desc);
create index if not exists books_seller_created_idx on public.books (seller_id, created_at desc);
create index if not exists books_college_course_idx on public.books (college, course);
create index if not exists book_requests_seller_created_idx on public.book_requests (seller_id, created_at desc);
create index if not exists book_requests_buyer_created_idx on public.book_requests (buyer_id, created_at desc);
create index if not exists book_requests_book_id_idx on public.book_requests (book_id);

-- Auto-create / sync profile row when a user signs up via Email, Google, or Apple
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_name text;
  v_college text;
  v_avatar text;
  v_verified boolean;
begin
  v_name := coalesce(
    nullif(trim(new.raw_user_meta_data ->> 'full_name'), ''),
    nullif(trim(new.raw_user_meta_data ->> 'name'), ''),
    split_part(coalesce(new.email, 'Student'), '@', 1),
    'Urbook student'
  );
  v_college := coalesce(nullif(trim(new.raw_user_meta_data ->> 'college'), ''), '');
  v_avatar := coalesce(
    nullif(trim(new.raw_user_meta_data ->> 'avatar_url'), ''),
    nullif(trim(new.raw_user_meta_data ->> 'picture'), '')
  );
  v_verified := new.email_confirmed_at is not null;

  insert into public.profiles (id, full_name, college, avatar_url, email_verified)
  values (new.id, v_name, v_college, v_avatar, v_verified)
  on conflict (id) do update
    set email_verified = excluded.email_verified,
        avatar_url = coalesce(public.profiles.avatar_url, excluded.avatar_url),
        updated_at = now();

  return new;
end;
$$;

revoke execute on function public.handle_new_user() from public, anon, authenticated;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

create or replace function public.handle_user_verified()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.email_confirmed_at is distinct from old.email_confirmed_at then
    update public.profiles
      set email_verified = (new.email_confirmed_at is not null),
          updated_at = now()
      where id = new.id;
  end if;
  return new;
end;
$$;

revoke execute on function public.handle_user_verified() from public, anon, authenticated;

create trigger on_auth_user_verified
  after update of email_confirmed_at on auth.users
  for each row execute procedure public.handle_user_verified();

-- Explicit table grants for Data API
grant select on public.profiles to anon, authenticated;
grant insert, update on public.profiles to authenticated;

grant select on public.books to anon, authenticated;
grant insert, update, delete on public.books to authenticated;

grant select, insert, update on public.book_requests to authenticated;

-- Enable Row Level Security
alter table public.profiles enable row level security;
alter table public.books enable row level security;
alter table public.book_requests enable row level security;

-- Profiles RLS
create policy "profiles are readable"
  on public.profiles for select
  to anon, authenticated
  using (true);

create policy "users insert their own profile"
  on public.profiles for insert
  to authenticated
  with check ((select auth.uid()) = id);

create policy "users update their own profile"
  on public.profiles for update
  to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

-- Books RLS
create policy "available books are readable"
  on public.books for select
  to anon, authenticated
  using (status = 'available' or seller_id = (select auth.uid()));

create policy "users create their own books"
  on public.books for insert
  to authenticated
  with check ((select auth.uid()) = seller_id);

create policy "users update their own books"
  on public.books for update
  to authenticated
  using ((select auth.uid()) = seller_id)
  with check ((select auth.uid()) = seller_id);

create policy "users delete their own books"
  on public.books for delete
  to authenticated
  using ((select auth.uid()) = seller_id);

-- Book requests RLS
create policy "participants can view book requests"
  on public.book_requests for select
  to authenticated
  using (buyer_id = (select auth.uid()) or seller_id = (select auth.uid()));

create policy "authenticated buyers can create book requests"
  on public.book_requests for insert
  to authenticated
  with check (buyer_id = (select auth.uid()) and buyer_id <> seller_id);

create policy "sellers can update request status"
  on public.book_requests for update
  to authenticated
  using (seller_id = (select auth.uid()))
  with check (seller_id = (select auth.uid()));

-- Storage bucket for optional book cover images
insert into storage.buckets (id, name, public)
values ('book-images', 'book-images', true)
on conflict (id) do nothing;

create policy "book images are publicly viewable"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'book-images');

create policy "users upload book images to own folder"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'book-images'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

create policy "users update own book images"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'book-images'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  )
  with check (
    bucket_id = 'book-images'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

create policy "users delete own book images"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'book-images'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );
