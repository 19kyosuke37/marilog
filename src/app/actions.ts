'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function addComment(postId: string, body: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('認証が必要です')

  const { error } = await supabase
    .from('comments')
    .insert([{ post_id: postId, user_id: user.id, body: body.trim() }] as never)
  if (error) throw new Error(error.message)

  revalidatePath('/')
}

export async function createPost(data: {
  post_type: 'married' | 'before'
  concern_tags: string[]
  body: string
  anxiety_level?: number | null
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('認証が必要です')

  const { error } = await supabase
    .from('posts')
    .insert([{ user_id: user.id, ...data }] as never)
  if (error) throw new Error(error.message)

  revalidatePath('/')
}

export async function deletePost(postId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('認証が必要です')

  const { error } = await supabase
    .from('posts')
    .delete()
    .eq('id', postId)
    .eq('user_id', user.id)
  if (error) throw new Error(error.message)

  revalidatePath('/')
}

export async function deleteComment(commentId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('認証が必要です')

  const { error } = await supabase
    .from('comments')
    .delete()
    .eq('id', commentId)
    .eq('user_id', user.id)
  if (error) throw new Error(error.message)

  revalidatePath('/')
}

export async function markNotificationsRead() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return
  await supabase
    .from('notifications')
    .update({ is_read: true } as never)
    .eq('user_id', user.id)
    .eq('is_read', false)
  revalidatePath('/mypage')
}

export async function toggleLike(commentId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('認証が必要です')

  const { data: comment } = await supabase
    .from('comments')
    .select('user_id')
    .eq('id', commentId)
    .single()
  if ((comment as { user_id: string } | null)?.user_id === user.id) return

  const { data: existing } = await supabase
    .from('comment_likes')
    .select('id')
    .eq('comment_id', commentId)
    .eq('user_id', user.id)
    .maybeSingle()

  const ex = existing as { id: string } | null

  if (ex) {
    await supabase.from('comment_likes').delete().eq('id', ex.id)
  } else {
    await supabase
      .from('comment_likes')
      .insert([{ comment_id: commentId, user_id: user.id }] as never)
  }

  revalidatePath('/')
}
