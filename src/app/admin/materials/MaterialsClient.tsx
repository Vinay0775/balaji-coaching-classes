'use client';

import { useState } from 'react';
import { FolderOpen, FileText, UploadCloud, Loader2, Link as LinkIcon, Trash2, GraduationCap, Users, User } from 'lucide-react';
import toast from 'react-hot-toast';

export default function MaterialsClient({ courses, students, initialNotes, initialAssignments }: any) {
  const [activeTab, setActiveTab] = useState<'notes' | 'assignments'>('notes');
  const [notes, setNotes] = useState(initialNotes);
  const [assignments, setAssignments] = useState(initialAssignments);
  
  const [isUploading, setIsUploading] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(courses[0]?._id || '');
  const [targetType, setTargetType] = useState<'all' | 'student'>('all');
  const [selectedStudent, setSelectedStudent] = useState('');
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !title || !selectedCourse) {
      toast.error('Please fill in Title and Select a Course first');
      return;
    }

    if (targetType === 'student' && !selectedStudent) {
      toast.error('Please select a student');
      return;
    }

    if (activeTab === 'assignments' && !dueDate) {
      toast.error('Please select a Due Date for the assignment');
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      // 1. Upload to Cloudinary
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      
      if (!data.url) throw new Error(data.error);

      // 2. Save to Database
      const saveRes = await fetch('/api/admin/materials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: activeTab,
          courseId: selectedCourse,
          studentId: targetType === 'student' ? selectedStudent : undefined,
          title,
          fileUrl: data.url,
          dueDate: activeTab === 'assignments' ? dueDate : undefined,
        }),
      });
      const saveData = await saveRes.json();
      
      if (saveRes.ok) {
        toast.success(`${activeTab === 'notes' ? 'Note' : 'Assignment'} uploaded successfully!`);
        setTitle('');
        setDueDate('');
        setSelectedStudent('');
        if (activeTab === 'notes') setNotes([saveData.doc, ...notes]);
        else setAssignments([saveData.doc, ...assignments]);
      } else {
        throw new Error(saveData.error);
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to upload file');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: string, type: 'notes' | 'assignments') => {
    if (!confirm('Are you sure you want to delete this file?')) return;
    
    try {
      const res = await fetch(`/api/admin/materials?id=${id}&type=${type}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Deleted successfully');
        if (type === 'notes') setNotes(notes.filter((n: any) => n._id !== id));
        else setAssignments(assignments.filter((a: any) => a._id !== id));
      } else {
        toast.error('Failed to delete');
      }
    } catch (error) {
      toast.error('An error occurred');
    }
  };

  const items = activeTab === 'notes' ? notes : assignments;

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      <div className="flex items-center justify-between" style={{ marginBottom: '32px' }}>
        <div>
          <h1 className="text-3xl font-black text-white" style={{ marginBottom: '8px' }}>Course <span className="gradient-text">Materials</span> 📚</h1>
          <p className="text-slate-400 text-lg">Upload notes and assignments for students.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-white/10 mb-8">
        <button 
          onClick={() => setActiveTab('notes')}
          className={`pb-4 px-4 font-bold text-sm transition-colors border-b-2 ${activeTab === 'notes' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-400 hover:text-white'}`}
        >
          Study Notes
        </button>
        <button 
          onClick={() => setActiveTab('assignments')}
          className={`pb-4 px-4 font-bold text-sm transition-colors border-b-2 ${activeTab === 'assignments' ? 'border-cyan-500 text-cyan-400' : 'border-transparent text-slate-400 hover:text-white'}`}
        >
          Assignments
        </button>
      </div>

      <div className="grid lg:grid-cols-3" style={{ gap: '32px' }}>
        
        {/* Upload Form */}
        <div className="glass-card border-white/5 h-fit" style={{ padding: '24px' }}>
          <h2 className="text-xl font-bold text-white flex items-center" style={{ gap: '8px', marginBottom: '24px' }}>
            <UploadCloud className="w-5 h-5 text-indigo-400" /> Upload New
          </h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2 block">Select Course</label>
              <select 
                value={selectedCourse} 
                onChange={e => setSelectedCourse(e.target.value)}
                className="w-full bg-[#0a0e1a] border border-white/10 rounded-lg p-2.5 text-white outline-none focus:border-indigo-500"
              >
                {courses.map((c: any) => (
                  <option key={c._id} value={c._id}>{c.title}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2 block">Target Audience</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer text-slate-300 text-sm">
                  <input type="radio" name="target" checked={targetType === 'all'} onChange={() => setTargetType('all')} className="accent-indigo-500" />
                  All Students
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-slate-300 text-sm">
                  <input type="radio" name="target" checked={targetType === 'student'} onChange={() => setTargetType('student')} className="accent-indigo-500" />
                  Specific Student
                </label>
              </div>
            </div>

            {targetType === 'student' && (
              <div>
                <label className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2 block">Select Student</label>
                <select 
                  value={selectedStudent} 
                  onChange={e => setSelectedStudent(e.target.value)}
                  className="w-full bg-[#0a0e1a] border border-white/10 rounded-lg p-2.5 text-white outline-none focus:border-indigo-500"
                >
                  <option value="">-- Choose Student --</option>
                  {students.map((s: any) => (
                    <option key={s._id} value={s._id}>{s.name} ({s.email})</option>
                  ))}
                </select>
              </div>
            )}
            
            <div>
              <label className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2 block">Document Title</label>
              <input 
                value={title}
                onChange={e => setTitle(e.target.value)}
                type="text" 
                placeholder="e.g. Chapter 1 PDF" 
                className="w-full bg-[#0a0e1a] border border-white/10 rounded-lg p-2.5 text-white outline-none focus:border-indigo-500" 
              />
            </div>

            {activeTab === 'assignments' && (
              <div>
                <label className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2 block">Due Date</label>
                <input 
                  value={dueDate}
                  onChange={e => setDueDate(e.target.value)}
                  type="date" 
                  className="w-full bg-[#0a0e1a] border border-white/10 rounded-lg p-2.5 text-white outline-none focus:border-indigo-500 [color-scheme:dark]" 
                />
              </div>
            )}

            <div className="mt-4">
              <label className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2 block">Choose File (PDF/Image)</label>
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-white/10 border-dashed rounded-xl cursor-pointer bg-white/[0.02] hover:bg-white/[0.04] transition-colors relative overflow-hidden">
                {isUploading ? (
                  <div className="flex flex-col items-center">
                    <Loader2 className="w-8 h-8 text-indigo-400 animate-spin mb-2" />
                    <span className="text-slate-400 text-sm">Uploading to Cloud...</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <UploadCloud className="w-8 h-8 text-slate-500 mb-2" />
                    <p className="mb-2 text-sm text-slate-400"><span className="font-semibold text-indigo-400">Click to browse</span></p>
                  </div>
                )}
                <input type="file" className="hidden" onChange={handleFileUpload} disabled={isUploading} accept=".pdf,.doc,.docx,.jpg,.png" />
              </label>
            </div>
          </div>
        </div>

        {/* List */}
        <div className="lg:col-span-2 glass-card border-white/5" style={{ padding: '24px' }}>
          <h2 className="text-xl font-bold text-white flex items-center" style={{ gap: '8px', marginBottom: '24px' }}>
            {activeTab === 'notes' ? <FileText className="w-5 h-5 text-indigo-400" /> : <GraduationCap className="w-5 h-5 text-cyan-400" />} 
            Uploaded {activeTab === 'notes' ? 'Notes' : 'Assignments'}
          </h2>
          
          {items.length === 0 ? (
            <div className="text-center py-12 bg-white/[0.02] rounded-xl border border-dashed border-white/10">
              <FolderOpen className="w-12 h-12 text-slate-500 mx-auto mb-4 opacity-50" />
              <p className="text-slate-400">No materials found.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {items.map((item: any) => (
                <div key={item._id} className="bg-white/[0.02] border border-white/5 rounded-xl p-4 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center hover:bg-white/[0.04] transition-colors">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-white font-bold text-lg">{item.title}</span>
                      {item.dueDate && (
                        <span className="bg-red-500/10 text-red-400 text-[10px] px-2 py-0.5 rounded-md font-bold uppercase tracking-wider border border-red-500/20">
                          Due: {new Date(item.dueDate).toLocaleDateString()}
                        </span>
                      )}
                      {item.studentId && (
                        <span className="bg-amber-500/10 text-amber-400 text-[10px] px-2 py-0.5 rounded-md font-bold uppercase tracking-wider border border-amber-500/20">
                          For: {item.studentId.name}
                        </span>
                      )}
                    </div>
                    <div className="text-indigo-400 text-sm font-semibold flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5" /> {item.courseId?.title || 'Unknown Course'}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                    <a href={item.fileUrl} target="_blank" rel="noreferrer" className="btn-outline py-2 px-4 flex-1 sm:flex-none justify-center border-white/10 text-slate-300 hover:text-white text-sm">
                      <LinkIcon className="w-4 h-4 mr-2" /> View File
                    </a>
                    <button onClick={() => handleDelete(item._id, activeTab)} className="p-2.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors" title="Delete">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
