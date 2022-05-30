import supabase from '@/utils/supabase'

const bucketName = process.env.BUCKET_NAME

if (!bucketName) {
	throw new Error('No bucket name was given')
}

// TODO: fix access to storage
export const saveFile = async (path: string, file: any) => {
	const bucket = await supabase.storage.from(bucketName)
	const result = await bucket.upload(path, file)
	return {error: result.error, path: result.data?.Key}
}