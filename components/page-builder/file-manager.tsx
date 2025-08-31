'use client';

import { useState, useEffect, useCallback } from 'react';
import { Folder, Image, Video, File, Trash2, Copy, ExternalLink, Cloud, Search, X } from 'lucide-react';
// Media API 사용으로 대체
const listFiles = async (folder: string) => {
  const response = await fetch('/api/media')
  const result = await response.json()
  return { data: result.success ? result.data : [] }
}

const deleteFile = async (filePath: string) => {
  // 실제 구현은 필요시 추가
  console.log('Delete file:', filePath)
}

const getFileType = (filename: string): 'image' | 'video' | 'document' | 'other' => {
  const ext = filename.toLowerCase().split('.').pop() || ''
  if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) return 'image'
  if (['mp4', 'webm', 'avi', 'mov'].includes(ext)) return 'video'
  return 'other'
}

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}
import { Button } from '@/components/ui/button';

interface FileManagerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectFile?: (url: string) => void;
  fileType?: 'image' | 'video' | 'all';
}

interface FileItem {
  name: string;
  id: string;
  updated_at: string;
  metadata: Record<string, unknown>;
  publicUrl?: string;
  type: 'image' | 'video' | 'document' | 'other';
  size: number;
}

export function FileManager({ isOpen, onClose, onSelectFile, fileType = 'all' }: FileManagerProps) {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFolder, setSelectedFolder] = useState<'images' | 'videos' | 'all'>('all');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const loadFiles = useCallback(async () => {
    setLoading(true);
    try {
      // Storage API를 통해 파일 목록 가져오기
      const response = await fetch('/api/storage-images');
      const result = await response.json();
      
      if (result.success && result.data) {
        const filesWithMetadata = result.data.map((file: any) => ({
          name: file.filename,
          id: file.filename,
          updated_at: file.uploadedAt,
          metadata: { size: file.size },
          publicUrl: file.url,
          type: getFileType(file.filename),
          size: file.size
        }));

        // 파일 타입 필터링
        const filteredFiles = fileType === 'all' 
          ? filesWithMetadata 
          : filesWithMetadata.filter((file: FileItem) => file.type === fileType);

        setFiles(filteredFiles.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()));
      } else {
        console.error('Failed to load files:', result.error);
        setFiles([]);
      }
    } catch (error) {
      console.error('Failed to load files:', error);
      setFiles([]);
    } finally {
      setLoading(false);
    }
  }, [selectedFolder, fileType]);

  useEffect(() => {
    if (isOpen) {
      loadFiles();
    }
  }, [isOpen, loadFiles]);

  const filteredFiles = files.filter(file =>
    file.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (fileName: string, folder: string) => {
    try {
      const filePath = `careon/${folder}/${fileName}`;
      await deleteFile(filePath);
      setFiles(files.filter(file => file.name !== fileName));
      setDeleteConfirm(null);
    } catch (error) {
      console.error('Failed to delete file:', error);
    }
  };

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    // TODO: Add toast notification
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'image':
        return <Image className="w-5 h-5 text-blue-600" aria-label="이미지 파일" />;
      case 'video':
        return <Video className="w-5 h-5 text-purple-600" />;
      default:
        return <File className="w-5 h-5 text-gray-600" />;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-2">
            <Cloud className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold">Supabase Storage 파일 관리</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Controls */}
        <div className="p-6 border-b space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="파일 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Folder selection */}
          <div className="flex space-x-2">
            <button
              onClick={() => setSelectedFolder('all')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                selectedFolder === 'all'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Folder className="w-4 h-4 inline mr-2" />
              전체
            </button>
            <button
              onClick={() => setSelectedFolder('images')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                selectedFolder === 'images'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Image className="w-4 h-4 inline mr-2" aria-label="이미지" />
              이미지
            </button>
            <button
              onClick={() => setSelectedFolder('videos')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                selectedFolder === 'videos'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Video className="w-4 h-4 inline mr-2" />
              동영상
            </button>
          </div>
        </div>

        {/* File list */}
        <div className="flex-1 overflow-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-gray-600">파일을 불러오는 중...</span>
            </div>
          ) : filteredFiles.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Cloud className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p>파일이 없습니다</p>
              <p className="text-sm">파일을 업로드하여 시작하세요</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredFiles.map((file) => (
                <div
                  key={file.id}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => onSelectFile?.(file.publicUrl || '')}
                >
                  {/* File preview */}
                  <div className="aspect-video bg-gray-100 rounded-lg mb-3 flex items-center justify-center overflow-hidden">
                    {file.type === 'image' ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={file.publicUrl}
                        alt={file.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    ) : (
                      getFileIcon(file.type)
                    )}
                  </div>

                  {/* File info */}
                  <div className="space-y-2">
                    <h3 className="font-medium text-sm truncate" title={file.name}>
                      {file.name}
                    </h3>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{formatFileSize(file.size)}</span>
                      <span>{new Date(file.updated_at).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between mt-3 pt-3 border-t">
                    <div className="flex items-center space-x-2">
                      {getFileIcon(file.type)}
                      <span className="text-xs text-gray-500 uppercase">
                        {file.type}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopyUrl(file.publicUrl || '');
                        }}
                        className="p-1.5 hover:bg-gray-100 rounded"
                        title="URL 복사"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(file.publicUrl, '_blank');
                        }}
                        className="p-1.5 hover:bg-gray-100 rounded"
                        title="새 탭에서 열기"
                      >
                        <ExternalLink className="w-3 h-3" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteConfirm(file.name);
                        }}
                        className="p-1.5 hover:bg-red-100 text-red-600 rounded"
                        title="삭제"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t bg-gray-50">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              총 {filteredFiles.length}개 파일
            </p>
            <Button onClick={onClose} variant="outline">
              닫기
            </Button>
          </div>
        </div>
      </div>

      {/* Delete confirmation modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-60 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">파일 삭제</h3>
            <p className="text-gray-600 mb-6">
              <strong>{deleteConfirm}</strong> 파일을 삭제하시겠습니까?
              <br />
              이 작업은 되돌릴 수 없습니다.
            </p>
            <div className="flex space-x-3">
              <Button
                onClick={() => {
                  const folder = files.find(f => f.name === deleteConfirm)?.type === 'image' ? 'images' : 'videos';
                  handleDelete(deleteConfirm, folder);
                }}
                variant="destructive"
                className="flex-1"
              >
                삭제
              </Button>
              <Button
                onClick={() => setDeleteConfirm(null)}
                variant="outline"
                className="flex-1"
              >
                취소
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}