import React, { useState } from 'react';
import { POSTS } from '../utils/prototypeData';
import { FileText, Plus, Globe, CheckCircle2, Eye, Edit3 } from 'lucide-react';

export default function ContentPage() {
  const [posts, setPosts] = useState(POSTS);
  const [editingSEO, setEditingSEO] = useState(null);
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDesc, setMetaDesc] = useState('');
  const [creatingNew, setCreatingNew] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCat, setNewCat] = useState('area-guides');
  const [newExcerpt, setNewExcerpt] = useState('');

  const handleEditSEO = (post) => {
    setEditingSEO(post);
    setMetaTitle(post.metaTitle || post.title);
    setMetaDesc(post.metaDesc || post.excerpt);
  };

  const handleSaveSEO = (e) => {
    e.preventDefault();
    setPosts(
      posts.map((p) =>
        p.slug === editingSEO.slug ? { ...p, metaTitle, metaDesc } : p
      )
    );
    setEditingSEO(null);
  };

  const handleCreatePost = (e) => {
    e.preventDefault();
    const slug = newTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const newP = {
      slug,
      title: newTitle,
      cat: newCat,
      excerpt: newExcerpt,
      date: new Date().toISOString().split('T')[0],
      read: 5,
      v: 1,
      tags: [newCat, 'Dhaka'],
      metaTitle: newTitle,
      metaDesc: newExcerpt,
    };
    setPosts([newP, ...posts]);
    setCreatingNew(false);
    setNewTitle('');
    setNewExcerpt('');
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#e3e7ef] shadow-sm">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#1c2847] tracking-tight">
            Content & Real Estate Blog Management
          </h1>
          <p className="text-sm text-[#667089] mt-1">
            Publish Dhaka sector guides, legal advice for flat buyers, and manage search engine SEO tags.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setCreatingNew(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#f2961d] text-white font-semibold text-xs hover:bg-[#d97f0a] transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>New Article Draft</span>
        </button>
      </div>

      {/* Posts Table */}
      <div className="bg-white rounded-2xl border border-[#e3e7ef] shadow-sm overflow-hidden">
        <div className="p-4 border-b border-[#e3e7ef] flex items-center justify-between bg-[#fafbfd]">
          <span className="text-sm font-bold text-[#1c2847]">
            Published Articles ({posts.length})
          </span>
          <span className="text-xs text-[#667089]">
            Live on TrueSpace public portal
          </span>
        </div>

        <div className="divide-y divide-[#e3e7ef]">
          {posts.length > 0 ? (
            posts.map((post) => (
              <div key={post.slug} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-[#f8fafd] transition-colors">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-[#fff4e5] text-[#f2961d] border border-[#fed7aa]">
                      {post.cat.toUpperCase()}
                    </span>
                    <span className="text-xs text-[#667089]">{post.date}</span>
                    <span className="text-xs text-[#667089]">· {post.read || 5} min read</span>
                    <span className="text-xs text-[#667089]">· {post.v || 2100} views</span>
                  </div>

                  <h3 className="text-base font-bold text-[#1c2847]">
                    {post.title}
                  </h3>

                  <p className="text-xs text-[#667089] max-w-2xl line-clamp-2">
                    {post.excerpt}
                  </p>

                  <div className="text-[11px] text-[#667089]">
                    SEO Title: <span className="font-mono text-[#1c2847]">{post.metaTitle || post.title}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start md:self-auto">
                  <button
                    type="button"
                    onClick={() => handleEditSEO(post)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white text-[#1c2847] hover:bg-[#eef1f8] border border-[#e3e7ef] transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit SEO</span>
                  </button>

                  <a
                    href={`http://localhost:3000/blog/${post.slug}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-[#e3e7ef] text-[#1c2847] hover:bg-[#eef1f8] transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Preview</span>
                  </a>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-xs text-[#667089]">
              No published articles yet. Click &quot;+ New Article&quot; above to create one.
            </div>
          )}
        </div>
      </div>

      {/* CREATE DRAFT MODAL */}
      {creatingNew && (
        <div className="fixed inset-0 bg-[#0f1730]/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#e3e7ef] rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 text-[#1d2333]">
            <h3 className="text-lg font-bold text-[#1c2847]">Create New Article Draft</h3>
            <form onSubmit={handleCreatePost} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#667089] mb-1">Article Headline</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dhanmondi Lake view apartments guide"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full p-2.5 text-xs rounded-xl bg-[#f6f7fb] border border-[#e3e7ef] text-[#1d2333] outline-none focus:border-[#f2961d]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#667089] mb-1">Category</label>
                <select
                  value={newCat}
                  onChange={(e) => setNewCat(e.target.value)}
                  className="w-full p-2.5 text-xs rounded-xl bg-[#f6f7fb] border border-[#e3e7ef] text-[#1d2333] outline-none"
                >
                  <option value="area-guides">Dhaka Area Guides</option>
                  <option value="legal-documents">Legal & Dolil Verification</option>
                  <option value="renting-tips">Renting & Tenancy</option>
                  <option value="investment">Property Investment</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#667089] mb-1">Short Excerpt</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Brief summary for the article card..."
                  value={newExcerpt}
                  onChange={(e) => setNewExcerpt(e.target.value)}
                  className="w-full p-2.5 text-xs rounded-xl bg-[#f6f7fb] border border-[#e3e7ef] text-[#1d2333] outline-none focus:border-[#f2961d]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setCreatingNew(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[#667089] hover:bg-[#eef1f8]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#f2961d] text-white hover:bg-[#d97f0a] shadow-sm"
                >
                  Publish Article Draft
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT SEO MODAL */}
      {editingSEO && (
        <div className="fixed inset-0 bg-[#0f1730]/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#e3e7ef] rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 text-[#1d2333]">
            <h3 className="text-lg font-bold text-[#1c2847]">Edit Search Engine (SEO) Meta Tags</h3>
            <p className="text-xs text-[#667089]">
              Customize how this article appears on Google and social media shares.
            </p>

            <form onSubmit={handleSaveSEO} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#667089] mb-1">Meta Title</label>
                <input
                  type="text"
                  required
                  value={metaTitle}
                  onChange={(e) => setMetaTitle(e.target.value)}
                  className="w-full p-2.5 text-xs rounded-xl bg-[#f6f7fb] border border-[#e3e7ef] text-[#1d2333] outline-none focus:border-[#f2961d]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#667089] mb-1">Meta Description</label>
                <textarea
                  required
                  rows={3}
                  value={metaDesc}
                  onChange={(e) => setMetaDesc(e.target.value)}
                  className="w-full p-2.5 text-xs rounded-xl bg-[#f6f7fb] border border-[#e3e7ef] text-[#1d2333] outline-none focus:border-[#f2961d]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingSEO(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[#667089] hover:bg-[#eef1f8]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#f2961d] text-white hover:bg-[#d97f0a] shadow-sm"
                >
                  Save SEO Meta Tags
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
