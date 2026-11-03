import React, { useState } from 'react';
import { Folder, FileText, Image, Music, Download, HardDrive, CheckCircle } from 'lucide-react';
import { sounds } from '../../utils/sound';

export const FilesApp: React.FC = () => {
  const [selectedFolder, setSelectedFolder] = useState<string>('all');
  const [selectedFile, setSelectedFile] = useState<{ name: string; size: string; type: string } | null>(null);

  const files = [
    { name: 'TestOS-Architecture-v4.pdf', size: '2.4 MB', type: 'doc', folder: 'docs' },
    { name: 'alpine_sunset_capture.jpg', size: '4.8 MB', type: 'image', folder: 'photos' },
    { name: 'ambient_soundscape_mix.mp3', size: '8.1 MB', type: 'audio', folder: 'audio' },
    { name: 'galaxy_runner_bundle.apk', size: '19.2 MB', type: 'download', folder: 'downloads' },
    { name: 'contacts_backup_cloud.json', size: '124 KB', type: 'doc', folder: 'docs' },
  ];

  const filtered = selectedFolder === 'all' ? files : files.filter((f) => f.folder === selectedFolder);

  return (
    <div className="flex-1 flex flex-col bg-slate-950 text-white select-none p-4 space-y-4 overflow-hidden">
      {/* Storage Header */}
      <div className="p-4 bg-white/5 rounded-2xl border border-white/10 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="flex items-center gap-1.5 font-bold text-sky-400">
            <HardDrive className="w-4 h-4" /> Device Internal Storage
          </span>
          <span className="font-mono text-white/60">24.5 GB / 128 GB</span>
        </div>
        <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden flex">
          <div className="bg-sky-400 h-full w-[12%]" title="System" />
          <div className="bg-purple-400 h-full w-[8%]" title="Apps" />
          <div className="bg-emerald-400 h-full w-[5%]" title="Photos" />
        </div>
        <div className="flex items-center gap-4 text-[10px] text-white/50 pt-1">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-sky-400" /> System (15GB)
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-purple-400" /> Apps (6GB)
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400" /> Media (3.5GB)
          </span>
        </div>
      </div>

      {/* Folders filter */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
        {[
          { label: 'All Files', id: 'all' },
          { label: 'Downloads', id: 'downloads' },
          { label: 'Photos', id: 'photos' },
          { label: 'Docs', id: 'docs' },
          { label: 'Audio', id: 'audio' },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => {
              sounds.click();
              setSelectedFolder(f.id);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs whitespace-nowrap transition-all ${
              selectedFolder === f.id
                ? 'bg-sky-500 text-white font-bold'
                : 'bg-white/5 text-white/60 hover:bg-white/10'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* File List */}
      <div className="flex-1 overflow-y-auto space-y-2 no-scrollbar">
        {filtered.map((file, idx) => (
          <div
            key={idx}
            onClick={() => {
              sounds.click();
              setSelectedFile(file);
            }}
            className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 flex items-center justify-between cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-sky-400">
                {file.type === 'doc' && <FileText className="w-4 h-4" />}
                {file.type === 'image' && <Image className="w-4 h-4" />}
                {file.type === 'audio' && <Music className="w-4 h-4" />}
                {file.type === 'download' && <Download className="w-4 h-4" />}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-white truncate max-w-[190px]">
                  {file.name}
                </p>
                <p className="text-[10px] text-white/40">{file.size}</p>
              </div>
            </div>
            <span className="text-[10px] text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded-md">
              Stored
            </span>
          </div>
        ))}
      </div>

      {/* File Detail Modal */}
      {selectedFile && (
        <div className="p-3.5 bg-sky-950/70 border border-sky-400/30 rounded-2xl flex items-center justify-between text-xs">
          <div>
            <p className="font-bold text-white">{selectedFile.name}</p>
            <p className="text-[10px] text-sky-300">Size: {selectedFile.size} · Cloud Synced</p>
          </div>
          <button
            onClick={() => setSelectedFile(null)}
            className="px-3 py-1 bg-white/15 hover:bg-white/25 rounded-lg text-white"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
};
