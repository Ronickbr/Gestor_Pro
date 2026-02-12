insert into storage.buckets (id, name, public)
values ('client-avatars', 'client-avatars', true)
on conflict (id) do nothing;

-- Drop policies if they exist to avoid errors
drop policy if exists "Public Access" on storage.objects;
drop policy if exists "Authenticated Upload" on storage.objects;
drop policy if exists "Authenticated Update" on storage.objects;
drop policy if exists "Authenticated Delete" on storage.objects;

create policy "Public Access"
  on storage.objects for select
  using ( bucket_id = 'client-avatars' );

create policy "Authenticated Upload"
  on storage.objects for insert
  with check ( bucket_id = 'client-avatars' and auth.role() = 'authenticated' );

create policy "Authenticated Update"
  on storage.objects for update
  using ( bucket_id = 'client-avatars' and auth.role() = 'authenticated' );

create policy "Authenticated Delete"
  on storage.objects for delete
  using ( bucket_id = 'client-avatars' and auth.role() = 'authenticated' );
