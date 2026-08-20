'use client';

import { useEffect, useState } from 'react';
import { useEditor, EditorContent, type Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import { TableKit, TableCell, TableHeader } from '@tiptap/extension-table';
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  CodeXml,
  Columns3,
  Combine,
  Heading2,
  Heading3,
  ImageIcon,
  Italic,
  Link2,
  Link2Off,
  List,
  ListOrdered,
  Minus,
  MoveHorizontal,
  MoveVertical,
  Quote,
  Redo2,
  Rows3,
  SplitSquareVertical,
  Strikethrough,
  Table,
  Trash2,
  Underline as UnderlineIcon,
  Undo2,
} from 'lucide-react';
import { MediaPickerModal } from '@/components/media/MediaPickerModal';
import type { MediaItem } from '@/lib/media/types';
import { countContentImages } from '@/lib/cms/article-html';
import { SEO_PRIORITY_IMAGE_COUNT } from '@/lib/seo/image-alt';

const CONTENT_PLACEHOLDER =
  'Gõ nội dung tại đây. Dùng thanh công cụ phía trên để in đậm, thêm tiêu đề, danh sách hoặc chèn ảnh.';

const cellHeightAttribute = {
  height: {
    default: null as string | null,
    parseHTML: (element: HTMLElement) =>
      element.getAttribute('data-height') || element.style.height || null,
    renderHTML: (attributes: { height?: string | null }) => {
      if (!attributes.height) return {};
      const h = String(attributes.height);
      return { 'data-height': h, style: `height: ${h}; min-height: ${h}` };
    },
  },
};

const NewsTableCell = TableCell.extend({
  addAttributes() {
    return { ...this.parent?.(), ...cellHeightAttribute };
  },
});

const NewsTableHeader = TableHeader.extend({
  addAttributes() {
    return { ...this.parent?.(), ...cellHeightAttribute };
  },
});

function insertTableLikeWord(editor: Editor) {
  const spec = window.prompt('Kích thước bảng (hàng x cột), ví dụ 3x4:', '3x3');
  if (spec === null) return;
  const match = spec.trim().match(/^(\d+)\s*[x×,]\s*(\d+)$/i);
  const rows = match ? Number(match[1]) : 3;
  const cols = match ? Number(match[2]) : 3;
  editor
    .chain()
    .focus()
    .insertTable({
      rows: Math.min(20, Math.max(1, rows)),
      cols: Math.min(12, Math.max(1, cols)),
      withHeaderRow: true,
    })
    .run();
}

function setColumnWidth(editor: Editor) {
  const current =
    (editor.getAttributes('tableCell').colwidth as number[] | null)?.[0] ??
    (editor.getAttributes('tableHeader').colwidth as number[] | null)?.[0];
  const input = window.prompt('Độ rộng cột (px), ví dụ 160:', String(current ?? 140));
  if (input === null) return;
  const px = parseInt(input, 10);
  if (!Number.isFinite(px) || px < 40) return;
  editor.chain().focus().setCellAttribute('colwidth', [px]).run();
}

function setRowHeight(editor: Editor) {
  const current =
    (editor.getAttributes('tableCell').height as string | null) ??
    (editor.getAttributes('tableHeader').height as string | null);
  const input = window.prompt(
    'Chiều cao hàng (px), ví dụ 48:',
    String(current ?? '48').replace(/px$/i, ''),
  );
  if (input === null) return;
  const px = parseInt(input, 10);
  if (!Number.isFinite(px) || px < 24) return;
  editor.chain().focus().setCellAttribute('height', `${px}px`).run();
}

type Props = {
  label: string;
  value: string;
  onChange: (html: string) => void;
  priorImageCount?: number;
  altSuggestion?: string;
};

function ToolButton({
  title,
  active,
  disabled,
  onClick,
  children,
}: {
  title: string;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={title}
      disabled={disabled}
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className={`inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-600 transition-colors hover:bg-slate-200/80 disabled:opacity-40 ${
        active ? 'bg-slate-900 text-white hover:bg-slate-800' : ''
      }`}
    >
      {children}
    </button>
  );
}

function Divider() {
  return <span className="mx-0.5 h-5 w-px bg-slate-200" aria-hidden />;
}

function Toolbar({
  editor,
  sourceMode,
  onToggleSource,
  onInsertImage,
}: {
  editor: Editor;
  sourceMode: boolean;
  onToggleSource: () => void;
  onInsertImage: () => void;
}) {
  const setLink = () => {
    const previous = editor.getAttributes('link').href as string | undefined;
    const url = window.prompt('Nhập URL liên kết:', previous ?? 'https://');
    if (url === null) return;
    if (!url.trim()) {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url.trim() }).run();
  };

  return (
    <div className="flex flex-wrap items-center gap-0.5 border-b border-slate-200 bg-slate-50 px-2 py-1.5">
      <ToolButton
        title="Hoàn tác"
        disabled={!editor.can().undo()}
        onClick={() => editor.chain().focus().undo().run()}
      >
        <Undo2 size={15} />
      </ToolButton>
      <ToolButton
        title="Làm lại"
        disabled={!editor.can().redo()}
        onClick={() => editor.chain().focus().redo().run()}
      >
        <Redo2 size={15} />
      </ToolButton>
      <Divider />
      <select
        aria-label="Kiểu đoạn"
        className="h-8 max-w-[140px] rounded-md border border-slate-200 bg-white px-2 text-xs text-slate-700"
        value={
          editor.isActive('heading', { level: 2 })
            ? 'h2'
            : editor.isActive('heading', { level: 3 })
              ? 'h3'
              : editor.isActive('blockquote')
                ? 'quote'
                : 'p'
        }
        onChange={(e) => {
          const value = e.target.value;
          const chain = editor.chain().focus();
          if (value === 'h2') chain.toggleHeading({ level: 2 }).run();
          else if (value === 'h3') chain.toggleHeading({ level: 3 }).run();
          else if (value === 'quote') chain.toggleBlockquote().run();
          else chain.setParagraph().run();
        }}
      >
        <option value="p">Đoạn văn</option>
        <option value="h2">Tiêu đề H2</option>
        <option value="h3">Tiêu đề H3</option>
        <option value="quote">Trích dẫn</option>
      </select>
      <Divider />
      <ToolButton title="In đậm" active={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()}>
        <Bold size={15} />
      </ToolButton>
      <ToolButton title="In nghiêng" active={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()}>
        <Italic size={15} />
      </ToolButton>
      <ToolButton
        title="Gạch dưới"
        active={editor.isActive('underline')}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      >
        <UnderlineIcon size={15} />
      </ToolButton>
      <ToolButton
        title="Gạch ngang"
        active={editor.isActive('strike')}
        onClick={() => editor.chain().focus().toggleStrike().run()}
      >
        <Strikethrough size={15} />
      </ToolButton>
      <ToolButton
        title="Tiêu đề H2"
        active={editor.isActive('heading', { level: 2 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      >
        <Heading2 size={15} />
      </ToolButton>
      <ToolButton
        title="Tiêu đề H3"
        active={editor.isActive('heading', { level: 3 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
      >
        <Heading3 size={15} />
      </ToolButton>
      <Divider />
      <ToolButton
        title="Căn trái"
        active={editor.isActive({ textAlign: 'left' })}
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
      >
        <AlignLeft size={15} />
      </ToolButton>
      <ToolButton
        title="Căn giữa"
        active={editor.isActive({ textAlign: 'center' })}
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
      >
        <AlignCenter size={15} />
      </ToolButton>
      <ToolButton
        title="Căn phải"
        active={editor.isActive({ textAlign: 'right' })}
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
      >
        <AlignRight size={15} />
      </ToolButton>
      <Divider />
      <ToolButton
        title="Danh sách"
        active={editor.isActive('bulletList')}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        <List size={15} />
      </ToolButton>
      <ToolButton
        title="Danh sách đánh số"
        active={editor.isActive('orderedList')}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <ListOrdered size={15} />
      </ToolButton>
      <ToolButton
        title="Trích dẫn"
        active={editor.isActive('blockquote')}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
      >
        <Quote size={15} />
      </ToolButton>
      <ToolButton title="Đường kẻ ngang" onClick={() => editor.chain().focus().setHorizontalRule().run()}>
        <Minus size={15} />
      </ToolButton>
      <Divider />
      <ToolButton title="Chèn / sửa liên kết" active={editor.isActive('link')} onClick={setLink}>
        <Link2 size={15} />
      </ToolButton>
      <ToolButton
        title="Gỡ liên kết"
        disabled={!editor.isActive('link')}
        onClick={() => editor.chain().focus().unsetLink().run()}
      >
        <Link2Off size={15} />
      </ToolButton>
      <ToolButton title="Chèn ảnh từ thư viện" onClick={onInsertImage}>
        <ImageIcon size={15} />
      </ToolButton>
      <Divider />
      <ToolButton
        title="Chèn bảng — nhập số hàng x cột"
        active={editor.isActive('table')}
        onClick={() => insertTableLikeWord(editor)}
      >
        <Table size={15} />
      </ToolButton>
      <ToolButton
        title="Thêm hàng"
        disabled={!editor.can().addRowAfter()}
        onClick={() => editor.chain().focus().addRowAfter().run()}
      >
        <Rows3 size={15} />
      </ToolButton>
      <ToolButton
        title="Thêm cột"
        disabled={!editor.can().addColumnAfter()}
        onClick={() => editor.chain().focus().addColumnAfter().run()}
      >
        <Columns3 size={15} />
      </ToolButton>
      <ToolButton
        title="Xóa hàng"
        disabled={!editor.can().deleteRow()}
        onClick={() => editor.chain().focus().deleteRow().run()}
      >
        <Minus size={15} />
      </ToolButton>
      <ToolButton
        title="Xóa cột"
        disabled={!editor.can().deleteColumn()}
        onClick={() => editor.chain().focus().deleteColumn().run()}
      >
        <Minus size={15} className="rotate-90" />
      </ToolButton>
      <ToolButton
        title="Gộp ô đã chọn"
        disabled={!editor.can().mergeCells()}
        onClick={() => editor.chain().focus().mergeCells().run()}
      >
        <Combine size={15} />
      </ToolButton>
      <ToolButton
        title="Tách ô"
        disabled={!editor.can().splitCell()}
        onClick={() => editor.chain().focus().splitCell().run()}
      >
        <SplitSquareVertical size={15} />
      </ToolButton>
      <ToolButton
        title="Độ rộng cột (px) — hoặc kéo viền cột trong bảng"
        disabled={!editor.isActive('table')}
        onClick={() => setColumnWidth(editor)}
      >
        <MoveHorizontal size={15} />
      </ToolButton>
      <ToolButton
        title="Chiều cao hàng (px)"
        disabled={!editor.isActive('table')}
        onClick={() => setRowHeight(editor)}
      >
        <MoveVertical size={15} />
      </ToolButton>
      <ToolButton
        title="Xóa bảng"
        disabled={!editor.can().deleteTable()}
        onClick={() => editor.chain().focus().deleteTable().run()}
      >
        <Trash2 size={15} />
      </ToolButton>
      <div className="ml-auto">
        <ToolButton
          title={sourceMode ? 'Chế độ soạn thảo' : 'Xem HTML'}
          active={sourceMode}
          onClick={onToggleSource}
        >
          <CodeXml size={15} />
        </ToolButton>
      </div>
    </div>
  );
}

export function NewsContentEditor({
  label,
  value,
  onChange,
  priorImageCount = 0,
  altSuggestion = '',
}: Props) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const [sourceMode, setSourceMode] = useState(false);
  const [sourceHtml, setSourceHtml] = useState(value);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3, 4] },
        link: false,
        underline: false,
      }),
      Underline,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        HTMLAttributes: { rel: 'noopener noreferrer nofollow', target: '_blank' },
      }),
      Image.configure({
        HTMLAttributes: { class: 'rounded-xl' },
      }),
      TableKit.configure({
        table: {
          resizable: true,
          lastColumnResizable: true,
          handleWidth: 8,
          cellMinWidth: 64,
        },
        tableCell: false,
        tableHeader: false,
      }),
      NewsTableCell,
      NewsTableHeader,
      Placeholder.configure({
        placeholder: CONTENT_PLACEHOLDER,
      }),
    ],
    content: value || '',
    editorProps: {
      attributes: {
        class: 'news-wp-editor-content outline-none min-h-[320px] px-4 py-3',
      },
    },
    onUpdate: ({ editor: instance }) => {
      onChange(instance.getHTML());
    },
  });

  useEffect(() => {
    if (!editor || sourceMode) return;
    const current = editor.getHTML();
    if (value !== current) {
      editor.commands.setContent(value || '', { emitUpdate: false });
    }
  }, [editor, sourceMode, value]);

  const insertImage = (item: MediaItem) => {
    if (!editor) return;
    const inlineCount = countContentImages(editor.getHTML());
    const imageIndex = priorImageCount + inlineCount;
    const isPriority = imageIndex < SEO_PRIORITY_IMAGE_COUNT;
    const suggested =
      item.alt_text?.trim() ||
      altSuggestion.trim() ||
      item.name.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' ');

    let alt = suggested;
    if (isPriority) {
      const input = window.prompt(
        `Alt text cho ảnh #${imageIndex + 1} — Google ưu tiên 3 ảnh đầu bài.\nMô tả nội dung + từ khóa (vd. "vay tiền nhanh tại Y99"):`,
        suggested,
      );
      if (input === null) return;
      alt = input.trim();
      if (!alt) {
        window.alert('3 ảnh đầu bài viết cần alt text mô tả rõ — không bỏ qua thẻ alt.');
        return;
      }
    } else {
      const input = window.prompt('Alt text mô tả ảnh (tuỳ chọn, Enter để dùng gợi ý):', suggested);
      if (input === null) return;
      alt = input.trim() || suggested || 'Ảnh minh họa';
    }

    editor.chain().focus().setImage({ src: item.url, alt }).run();
  };

  const toggleSource = () => {
    if (!editor) return;
    if (sourceMode) {
      editor.commands.setContent(sourceHtml || '', { emitUpdate: true });
      onChange(sourceHtml);
      setSourceMode(false);
      return;
    }
    setSourceHtml(editor.getHTML());
    setSourceMode(true);
  };

  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-slate-900">{label}</label>
      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        {editor ? (
          <Toolbar
            editor={editor}
            sourceMode={sourceMode}
            onToggleSource={toggleSource}
            onInsertImage={() => setPickerOpen(true)}
          />
        ) : (
          <div className="h-11 border-b border-slate-200 bg-slate-50" />
        )}
        {sourceMode ? (
          <textarea
            value={sourceHtml}
            onChange={(e) => {
              setSourceHtml(e.target.value);
              onChange(e.target.value);
            }}
            className="min-h-[320px] w-full resize-y bg-slate-950 px-4 py-3 font-mono text-xs leading-relaxed text-slate-100 outline-none"
            placeholder="Dán hoặc chỉnh HTML nội dung bài viết tại đây…"
            spellCheck={false}
          />
        ) : (
          <EditorContent editor={editor} />
        )}
      </div>
      <p className="text-xs text-slate-500">
        Viết như soạn thảo thông thường: bôi đen để định dạng, thêm tiêu đề H2/H3, danh sách, căn lề, liên kết.
        Trong bảng: kéo viền cột để đổi độ rộng (như Word). Nút mũi tên ngang/dọc để nhập rộng cột hoặc cao hàng (px). Kéo chọn nhiều ô rồi gộp/tách. Nút bảng để chọn số hàng × cột.
      </p>
      <MediaPickerModal
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onPick={insertImage}
        title="Chèn ảnh vào nội dung"
      />
    </div>
  );
}
