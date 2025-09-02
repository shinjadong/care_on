'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Folder, Image, Video, File, Trash2, Copy, ExternalLink, Cloud, Search, X, 
  Upload, Download, Play, Pause, Volume2, CheckCircle, ArrowRight, Plus 
} from 'lucide-react';
import { Button } from '@/components/ui/button';

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
  if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext)) return 'image'
  if (['mp4', 'webm', 'avi', 'mov', 'mkv', 'flv'].includes(ext)) return 'video'
  return 'other'
}

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

interface FileManagerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectFile?: (url: string, type: 'image' | 'video') => void;
  fileType?: 'image' | 'video' | 'all';
  mode?: 'browse' | 'select'; // 새로운 모드: browse(보기만) vs select(선택하여 적용)
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

export function FileManager({ 
  isOpen, 
  onClose, 
  onSelectFile, 
  fileType = 'all',
  mode = 'browse' 
}: FileManagerProps) {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFolder, setSelectedFolder] = useState<'images' | 'videos' | 'all'>('all');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [uploadMode, setUploadMode] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());
  const [previewFile, setPreviewFile] = useState<FileItem | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadFiles = useCallback(async () => {
    setLoading(true);
    try {
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
        let filteredFiles = filesWithMetadata;
        if (fileType !== 'all') {
          filteredFiles = filesWithMetadata.filter((file: FileItem) => file.type === fileType);
        }
        if (selectedFolder !== 'all') {
          filteredFiles = filteredFiles.filter((file: FileItem) => 
            selectedFolder === 'images' ? file.type === 'image' : file.type === 'video'
          );
        }

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

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadFiles = event.target.files;
    if (!uploadFiles) return;

    const formData = new FormData();
    Array.from(uploadFiles).forEach(file => {
      formData.append('files', file);
    });

    try {
      setLoading(true);
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        await loadFiles(); // 파일 목록 새로고침
        setUploadMode(false);
      } else {
        alert('업로드 실패');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('업로드 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

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

  const handleSelectFile = (file: FileItem) => {
    if (mode === 'select' && onSelectFile) {
      onSelectFile(file.publicUrl || '', file.type as 'image' | 'video');
      onClose();
    } else {
      setPreviewFile(file);
    }
  };

  const toggleFileSelection = (fileId: string) => {
    const newSelected = new Set(selectedFiles);
    if (newSelected.has(fileId)) {
      newSelected.delete(fileId);
    } else {
      newSelected.add(fileId);
    }
    setSelectedFiles(newSelected);
  };

  const applySelectedFiles = () => {
    const selectedFilesList = files.filter(f => selectedFiles.has(f.id));
    if (selectedFilesList.length > 0 && onSelectFile) {
      // 첫 번째 선택된 파일 적용 (나중에 복수 선택 지원 가능)
      const firstFile = selectedFilesList[0];
      onSelectFile(firstFile.publicUrl || '', firstFile.type as 'image' | 'video');
      onClose();
    }
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'image':
        return <Image className="w-8 h-8 text-blue-600" aria-label="이미지 파일" />;
      case 'video':
        return <Video className="w-8 h-8 text-purple-600" />;
      default:
        return <File className="w-8 h-8 text-gray-600" />;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-2">
            <Cloud className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold">
              파일 관리 {mode === 'select' ? '- 파일 선택' : ''}
            </h2>
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
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="파일 검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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

            {/* Upload Button */}
            <div className="flex items-center space-x-2">
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*,video/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <Button
                onClick={() => fileInputRef.current?.click()}
                variant="default"
                size="sm"
              >
                <Upload className="w-4 h-4 mr-2" />
                파일 업로드
              </Button>
            </div>
          </div>

          {/* Selection mode controls */}
          {mode === 'select' && selectedFiles.size > 0 && (
            <div className="flex items-center justify-between bg-blue-50 rounded-lg p-4">
              <span className="text-sm font-medium text-blue-700">
                {selectedFiles.size}개 파일 선택됨
              </span>
              <div className="flex items-center space-x-2">
                <Button
                  onClick={() => setSelectedFiles(new Set())}
                  variant="outline"
                  size="sm"
                >
                  선택 해제
                </Button>
                <Button
                  onClick={applySelectedFiles}
                  variant="default"
                  size="sm"
                >
                  <CheckCircle className="w-4 h-4 mr-1" />
                  적용하기
                </Button>
              </div>
            </div>
          )}
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
              <p className="text-lg mb-2">파일이 없습니다</p>
              <p className="text-sm mb-4">이미지나 동영상을 업로드하여 시작하세요</p>
              <Button 
                onClick={() => fileInputRef.current?.click()}
                variant="default"
              >
                <Plus className="w-4 h-4 mr-2" />
                첫 파일 업로드
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredFiles.map((file) => (
                <div
                  key={file.id}
                  className={`border rounded-lg p-4 transition-all cursor-pointer relative ${
                    selectedFiles.has(file.id) 
                      ? 'border-blue-500 bg-blue-50 shadow-md' 
                      : 'border-gray-200 hover:shadow-md hover:border-gray-300'
                  }`}
                  onClick={() => {
                    if (mode === 'select') {
                      toggleFileSelection(file.id);
                    } else {
                      handleSelectFile(file);
                    }
                  }}
                >
                  {/* Selection indicator */}
                  {mode === 'select' && (
                    <div className="absolute top-2 right-2 z-10">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        selectedFiles.has(file.id) 
                          ? 'bg-blue-500 border-blue-500' 
                          : 'bg-white border-gray-300'
                      }`}>
                        {selectedFiles.has(file.id) && (
                          <CheckCircle className="w-4 h-4 text-white" />
                        )}
                      </div>
                    </div>
                  )}

                  {/* File preview */}
                  <div className="aspect-video bg-gray-100 rounded-lg mb-3 flex items-center justify-center overflow-hidden relative">
                    {file.type === 'image' ? (
                      <img
                        src={file.publicUrl}
                        alt={file.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    ) : file.type === 'video' ? (
                      <div className="relative w-full h-full">
                        <video
                          src={file.publicUrl}
                          className="w-full h-full object-cover"
                          muted
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                          <Play className="w-8 h-8 text-white" />
                        </div>
                      </div>
                    ) : (
                      getFileIcon(file.type)
                    )}
                    
                    {/* File type badge */}
                    <div className="absolute bottom-2 left-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded ${
                        file.type === 'image' ? 'bg-blue-500 text-white' :
                        file.type === 'video' ? 'bg-purple-500 text-white' :
                        'bg-gray-500 text-white'
                      }`}>
                        {file.type === 'image' ? 'IMG' : file.type === 'video' ? 'VID' : 'FILE'}
                      </span>
                    </div>
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
                    </div>
                    <div className="flex items-center space-x-1">
                      {mode === 'select' ? (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectFile?.(file.publicUrl || '', file.type as 'image' | 'video');
                            onClose();
                          }}
                        >
                          <ArrowRight className="w-3 h-3 mr-1" />
                          적용
                        </Button>
                      ) : (
                        <>
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
                        </>
                      )}
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
              {selectedFiles.size > 0 && `(${selectedFiles.size}개 선택)`}
            </p>
            <div className="flex items-center space-x-2">
              {mode === 'select' && selectedFiles.size > 0 && (
                <Button onClick={applySelectedFiles} variant="default">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  {selectedFiles.size}개 파일 적용
                </Button>
              )}
              <Button onClick={onClose} variant="outline">
                닫기
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {previewFile && (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-60 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold">{previewFile.name}</h3>
              <button
                onClick={() => setPreviewFile(null)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 p-6 flex items-center justify-center">
              {previewFile.type === 'image' ? (
                <img
                  src={previewFile.publicUrl}
                  alt={previewFile.name}
                  className="max-w-full max-h-full object-contain"
                />
              ) : previewFile.type === 'video' ? (
                <video
                  src={previewFile.publicUrl}
                  controls
                  className="max-w-full max-h-full"
                />
              ) : (
                <div className="text-center">
                  {getFileIcon(previewFile.type)}
                  <p className="mt-2">미리보기를 지원하지 않는 파일입니다.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

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