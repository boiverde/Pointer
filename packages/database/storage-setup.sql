
-- 1. Create the storage bucket 'products'
insert into storage.buckets (id, name, public)
values ('products', 'products', true);

-- 2. Enable RLS (Row Level Security) - Good practice, though buckets have their own policies usually
-- storage.objects usually has RLS enabled by default.

-- 3. Policy: Allow Public Read Access (Anyone can view product images)
create policy "Public Access"
on storage.objects for select
using ( bucket_id = 'products' );

-- 4. Policy: Allow Authenticated Uploads (Only logged in users can upload)
-- Since we are using the Service Role or a logged in user in Admin, this allows uploads.
create policy "Authenticated Uploads"
on storage.objects for insert
with check ( bucket_id = 'products' AND auth.role() = 'authenticated' );

-- 5. Policy: Allow Updates (If you want to replace images)
create policy "Authenticated Updates"
on storage.objects for update
using ( bucket_id = 'products' AND auth.role() = 'authenticated' );
