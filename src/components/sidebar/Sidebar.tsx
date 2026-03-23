import SidebarHeader from '@/components/sidebar/SidebarHeader'
import ChapterList from '@/components/sidebar/ChapterList'
import type { DocumentHead } from '@/api/documents'

interface SidebarProps {
  activeChapterId: string
  onSelectChapter: (id: string) => void
  chapters?: DocumentHead[]
  isLoading?: boolean
  onCreateChapter?: () => void
  onDeleteChapter?: (id: string) => void
  onReorder?: (chapters: DocumentHead[]) => void
}

export default function Sidebar({
  activeChapterId,
  onSelectChapter,
  chapters = [],
  isLoading = false,
  onCreateChapter = () => {},
  onDeleteChapter,
  onReorder
}: SidebarProps) {
  return (
    <aside style={{ width: '200px', flexShrink: 0, borderRight: '1px solid #e5e5e5', display: 'flex', flexDirection: 'column', background: '#ffffff' }}>
      <SidebarHeader />
      <ChapterList
        chapters={chapters}
        activeChapterId={activeChapterId}
        isLoading={isLoading}
        onSelectChapter={onSelectChapter}
        onCreateChapter={onCreateChapter}
        onDeleteChapter={onDeleteChapter}
        onReorder={onReorder}
      />
    </aside>
  )
}
