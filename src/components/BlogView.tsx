import React, { useState } from 'react';
import { ArrowLeft, Search, Calendar, Folder, Tag, MessageSquare, Send, ChevronRight } from 'lucide-react';
import { BlogPost, Comment } from '../types';
import { useSound } from '../hooks/useSound';

interface BlogViewProps {
  posts: BlogPost[];
  categories: string[];
  onSaveComment: (postId: string, comment: Comment) => void;
  onBack: () => void;
  title?: string;
  subTitle?: string;
}

const AVATARS = [
  { id: 'mario', name: '마리오', emoji: '🍄' },
  { id: 'zelda', name: '젤다', emoji: '🛡️' },
  { id: 'link', name: '링크', emoji: '🗡️' },
  { id: 'kirby', name: '커비', emoji: '🌟' },
  { id: 'yoshi', name: '요시', emoji: '🥚' },
  { id: 'peach', name: '피치 공주', emoji: '👑' },
  { id: 'bowser', name: '쿠파', emoji: '🔥' }
];

export default function BlogView({ 
  posts, 
  categories, 
  onSaveComment, 
  onBack,
  title = "수업 기록 게시판",
  subTitle = "LES_JOURNAL_LOGS_v1.0"
}: BlogViewProps) {
  const { playSound } = useSound(); // Custom sound manager hook

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);

  // Comment posting states
  const [commentAuthor, setCommentAuthor] = useState<string>('');
  const [commentAvatar, setCommentAvatar] = useState<string>('mario');
  const [commentContent, setCommentContent] = useState<string>('');

  const activePost = posts.find(p => p.id === selectedPostId);

  // Filter posts
  const filteredPosts = posts.filter(post => {
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          post.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handlePostSelect = (id: string) => {
    playSound('select');
    setSelectedPostId(id);
    // Reset comment inputs
    setCommentAuthor('');
    setCommentContent('');
  };

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPostId || !commentAuthor.trim() || !commentContent.trim()) {
      playSound('error');
      return;
    }

    const newComment: Comment = {
      id: `comment_${Date.now()}`,
      author: commentAuthor,
      avatar: commentAvatar,
      content: commentContent,
      createdAt: new Date().toISOString()
    };

    onSaveComment(selectedPostId, newComment);
    playSound('save');

    // Reset fields
    setCommentContent('');
    alert('💬 댓글이 정상적으로 등록되었습니다!');
  };

  const getCategoryLabel = (cat: string) => {
    return cat;
  };

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case '수업 이야기': return 'bg-amber-100 border-amber-300 text-amber-700 font-extrabold';
      case '코드 연구실': return 'bg-sky-100 border-sky-300 text-sky-700 font-extrabold';
      case '아이디어': return 'bg-pink-100 border-pink-300 text-pink-700 font-extrabold';
      default: return 'bg-emerald-100 border-emerald-300 text-emerald-700 font-extrabold';
    }
  };

  return (
    <div id="blog_view" className="flex flex-col gap-5 text-zinc-800 font-sans select-text">
      
      {/* Navigation Header */}
      <div className="flex items-center justify-between border-b border-zinc-200 pb-3 select-none">
        {activePost ? (
          <button 
            onClick={() => {
              playSound('back');
              setSelectedPostId(null);
            }}
            className="flex items-center gap-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs px-3.5 py-1.5 rounded-full cursor-pointer border border-zinc-250 font-bold shadow-xs transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> B-BACK (글 목록으로)
          </button>
        ) : (
          <button 
            onClick={() => {
              playSound('back');
              onBack();
            }}
            className="flex items-center gap-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs px-3.5 py-1.5 rounded-full cursor-pointer border border-zinc-250 font-bold shadow-xs transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> B-BACK (홈으로)
          </button>
        )}
        <span className="text-xs font-mono font-black text-amber-600">{subTitle}</span>
      </div>

      {activePost ? (
        /* === BlogPost View Detail Mode === */
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`text-[10px] uppercase font-black px-2.5 py-0.5 rounded border ${getCategoryColor(activePost.category)}`}>
                {getCategoryLabel(activePost.category)}
              </span>
              <span className="text-xs text-zinc-400 font-mono flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" /> {new Date(activePost.createdAt).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
            </div>
            <h1 className="text-xl md:text-2xl font-black text-zinc-805 tracking-tight leading-snug">{activePost.title}</h1>
          </div>

          {/* Render Main Content body (handles newlines cleanly as Markdown paragraphs) */}
          <div className="bg-white p-6 rounded-2xl border border-zinc-220 leading-relaxed text-sm text-zinc-700 whitespace-pre-wrap font-sans font-medium shadow-xs">
            {activePost.content}
          </div>

          {/* Tags list */}
          {activePost.tags && activePost.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-1 border-b border-zinc-200 pb-4 select-none">
              {activePost.tags.map(tag => (
                <span key={tag} className="flex items-center gap-1 text-[10.5px] font-bold font-mono px-2 py-1 bg-zinc-100 border border-zinc-200 rounded-md text-zinc-650 hover:text-zinc-850">
                  <Tag className="w-3 h-3 text-zinc-400" /> #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Comments section */}
          <div className="mt-4 flex flex-col gap-6">
            <h3 className="text-sm font-black font-sans text-zinc-750 tracking-wider uppercase flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-amber-500" /> 댓글 이야기 ({activePost.comments?.length || 0})
            </h3>

            {/* Existing comments list */}
            <div id="comments_list" className="flex flex-col gap-3.5">
              {!activePost.comments || activePost.comments.length === 0 ? (
                <div className="p-6 text-center text-xs text-zinc-550 font-semibold border border-dashed border-zinc-200 bg-zinc-50/50 rounded-xl italic">
                  작성된 댓글이 솔솔 비어 있습니다. 첫 번째 댓글을 남겨 보세요!
                </div>
              ) : (
                activePost.comments.map(comm => {
                  const av = AVATARS.find(a => a.id === comm.avatar) || AVATARS[0];
                  return (
                    <div key={comm.id} className="p-4 bg-white border border-zinc-200 rounded-2xl flex gap-3.5 shadow-xs transition-all">
                      <div className="w-10 h-10 rounded-full bg-zinc-50 border border-zinc-200 flex items-center justify-center text-2xl shrink-0">
                        {av.emoji}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs font-bold text-zinc-700">{comm.author} <span className="text-[10px] text-amber-650/80 font-mono ml-1 font-black">[{av.name}]</span></span>
                          <span className="text-[10px] text-zinc-400 font-mono">{new Date(comm.createdAt).toLocaleDateString()}</span>
                        </div>
                        <p className="text-xs text-zinc-650 leading-relaxed font-sans">{comm.content}</p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Comment posting box */}
            <form onSubmit={handlePostComment} className="bg-zinc-50/40 p-4 rounded-2xl border border-zinc-200 shadow-xs flex flex-col gap-3">
              <div className="text-[10px] font-black font-mono text-zinc-400 uppercase tracking-widest mb-1 select-none">
                💬 WRITE A REPLY COMMENT
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Author Input */}
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-zinc-500">닉네임</label>
                  <input
                    type="text"
                    required
                    maxLength={15}
                    value={commentAuthor}
                    onChange={(e) => setCommentAuthor(e.target.value)}
                    placeholder="이름을 알려주세요"
                    className="w-full bg-white border border-zinc-250 rounded px-2.5 py-1.5 text-xs text-zinc-700 outline-none focus:border-amber-500 transition-colors shadow-xs"
                  />
                </div>

                {/* Avatar expression selection */}
                <div className="flex flex-col gap-1 select-none">
                  <label className="text-[10px] font-bold text-zinc-500">프로필 아바타</label>
                  <select
                    value={commentAvatar}
                    onChange={(e) => setCommentAvatar(e.target.value)}
                    className="w-full bg-white border border-zinc-250 rounded px-2.5 py-1.5 text-xs text-zinc-700 outline-none focus:border-amber-500 transition-colors cursor-pointer shadow-xs"
                  >
                    {AVATARS.map(av => (
                      <option key={av.id} value={av.id}>{av.emoji} {av.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Text area */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-zinc-500">댓글 내용</label>
                <textarea
                  required
                  rows={2}
                  maxLength={250}
                  value={commentContent}
                  onChange={(e) => setCommentContent(e.target.value)}
                  placeholder="강의 후기 및 강의 피드백을 남겨 주세요."
                  className="w-full bg-white border border-zinc-250 rounded px-2.5 py-1.5 text-xs text-zinc-700 outline-none focus:border-amber-500 transition-colors resize-none shadow-xs"
                ></textarea>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                className="self-end px-4 py-1.5 bg-amber-500 hover:bg-amber-600 text-xs text-white font-extrabold rounded cursor-pointer flex items-center gap-1 transition-all shadow-xs border-b-2 border-amber-700"
              >
                <Send className="w-3 h-3" /> 댓글 전송 (A)
              </button>
            </form>

          </div>
        </div>
      ) : (
        /* === BlogPost Scroll View List Mode === */
        <div id="blog_list_panel" className="flex flex-col gap-4">
          
          {/* Filters & search line */}
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between select-none">
            {/* Category Filter Chips */}
            <div id="category_filters" className="flex flex-wrap gap-2">
              {['all', ...categories].map(cat => (
                <button
                  key={cat}
                  onClick={() => {
                    playSound('tick');
                    setSelectedCategory(cat);
                  }}
                  className={`px-3 py-1 text-xs rounded-full font-bold cursor-pointer border transition-all ${
                    selectedCategory === cat 
                      ? 'bg-amber-500 border-amber-500 text-white shadow-xs font-black' 
                      : 'bg-white border-zinc-200 text-zinc-500 hover:border-zinc-350 hover:bg-zinc-50 shadow-xs'
                  }`}
                >
                  {cat === 'all' ? '전체글' : getCategoryLabel(cat)}
                </button>
              ))}
            </div>

            {/* Keyword Search Input */}
            <div className="relative w-full sm:w-60">
              <input
                type="text"
                placeholder={`${title.replace(' 게시판', '')} 검색...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-zinc-250 rounded-full px-3.5 pl-8.5 py-1.5 text-xs text-zinc-700 outline-none focus:border-amber-500 transition-all font-medium shadow-xs"
              />
              <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* List display */}
          <div id="post_grid" className="flex flex-col gap-3.5 mt-2">
            {filteredPosts.length === 0 ? (
              <div className="p-16 text-center text-zinc-450 text-xs font-semibold border border-dashed border-zinc-250 bg-zinc-50/50 rounded-2xl italic">
                검색된 게시글이 존재하지 않습니다. 카테고리를 다시 클릭해 보세요!
              </div>
            ) : (
              filteredPosts.map(post => {
                const colors = getCategoryColor(post.category);
                return (
                  <div
                    key={post.id}
                    onClick={() => handlePostSelect(post.id)}
                    className="p-4 bg-white border border-zinc-200 rounded-2xl flex justify-between items-center cursor-pointer hover:bg-zinc-50 hover:border-zinc-350 shadow-xs transition-all duration-150"
                  >
                    <div className="flex-1 flex flex-col gap-2">
                       <div className="flex items-center gap-2">
                        <span className={`text-[9px] uppercase font-black px-1.5 py-0.2 rounded border ${colors}`}>
                          {getCategoryLabel(post.category)}
                        </span>
                        <span className="text-[10px] font-mono text-zinc-450">{new Date(post.createdAt).toLocaleDateString()}</span>
                      </div>
                      
                      <h4 className="text-sm md:text-base font-black text-zinc-800 tracking-tight">{post.title}</h4>
                      <p className="text-xs text-zinc-500 line-clamp-1 font-medium">{post.content}</p>
                    </div>

                    {/* Arrow right key badge */}
                    <div className="p-2 text-zinc-400 hover:text-zinc-600 shrink-0 select-none">
                      <ChevronRight className="w-5 h-5" />
                    </div>
                  </div>
                );
              })
            )}
          </div>

        </div>
      )}

    </div>
  );
}
