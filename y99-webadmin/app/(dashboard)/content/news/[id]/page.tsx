'use client';

import { useParams } from 'next/navigation';
import { NewsArticleEditor } from '@/components/content/NewsArticleEditor';

export default function EditNewsArticlePage() {
  const params = useParams<{ id: string }>();
  return <NewsArticleEditor articleId={params.id} />;
}
