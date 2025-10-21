
import React, { useState } from 'react';
import { useData, BlogPost } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';

const AddBlogModal = ({ onClose }: { onClose: () => void }) => {
    const { addBlogPost } = useData();
    const { showNotification } = useNotification();
    const [formData, setFormData] = useState<Omit<BlogPost, 'id'>>({
        title: '', category: '', date: new Date().toLocaleDateString('en-CA'), 
        excerpt: '', imageUrl: '', content: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const fullContent = formData.content || formData.excerpt;
        addBlogPost({ ...formData, content: fullContent });
        showNotification('Blog post added successfully!');
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-[100]" onClick={onClose}>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-8 w-full max-w-2xl" onClick={(e) => e.stopPropagation()}>
                <h2 className="text-2xl font-bold text-scout-green dark:text-white mb-6">Add New Blog Post</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input type="text" name="title" placeholder="Title" value={formData.title} onChange={handleChange} className="w-full px-3 py-2 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-scout-green" required />
                        <input type="text" name="category" placeholder="Category" value={formData.category} onChange={handleChange} className="w-full px-3 py-2 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-scout-green" required />
                    </div>
                    <input type="url" name="imageUrl" placeholder="Image URL" value={formData.imageUrl} onChange={handleChange} className="w-full px-3 py-2 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-scout-green" required />
                    <textarea name="excerpt" placeholder="Excerpt (short summary)" value={formData.excerpt} onChange={handleChange} className="w-full px-3 py-2 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-scout-green" rows={3} required />
                    <textarea name="content" placeholder="Full Content (optional, uses excerpt if blank)" value={formData.content} onChange={handleChange} className="w-full px-3 py-2 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-scout-green" rows={6} />
                    <div className="flex justify-end space-x-4 pt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 dark:text-gray-200 rounded-md">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-scout-green text-white rounded-md">Add Post</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const EditBlogModal = ({ post, onClose }: { post: BlogPost; onClose: () => void }) => {
    const { updateBlogPost } = useData();
    const { showNotification } = useNotification();
    const [formData, setFormData] = useState<Omit<BlogPost, 'id'>>({
        title: post.title, category: post.category, date: post.date, 
        excerpt: post.excerpt, imageUrl: post.imageUrl, content: post.content
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const fullContent = formData.content || formData.excerpt;
        updateBlogPost({ ...post, ...formData, content: fullContent });
        showNotification('Blog post updated successfully!');
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-[100]" onClick={onClose}>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-8 w-full max-w-2xl" onClick={(e) => e.stopPropagation()}>
                <h2 className="text-2xl font-bold text-scout-green dark:text-white mb-6">Edit Blog Post</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input type="text" name="title" placeholder="Title" value={formData.title} onChange={handleChange} className="w-full px-3 py-2 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-scout-green" required />
                        <input type="text" name="category" placeholder="Category" value={formData.category} onChange={handleChange} className="w-full px-3 py-2 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-scout-green" required />
                    </div>
                     <input type="date" name="date" value={new Date(formData.date).toLocaleDateString('en-CA')} onChange={handleChange} className="w-full px-3 py-2 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-scout-green" required />
                    <input type="url" name="imageUrl" placeholder="Image URL" value={formData.imageUrl} onChange={handleChange} className="w-full px-3 py-2 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-scout-green" required />
                    <textarea name="excerpt" placeholder="Excerpt (short summary)" value={formData.excerpt} onChange={handleChange} className="w-full px-3 py-2 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-scout-green" rows={3} required />
                    <textarea name="content" placeholder="Full Content (optional, uses excerpt if blank)" value={formData.content} onChange={handleChange} className="w-full px-3 py-2 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-scout-green" rows={6} />
                    <div className="flex justify-end space-x-4 pt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 dark:text-gray-200 rounded-md">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-scout-green text-white rounded-md">Save Changes</button>
                    </div>
                </form>
            </div>
        </div>
    );
};


const BlogDetailModal: React.FC<{ post: BlogPost; onClose: () => void }> = ({ post, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-[100] p-4" onClick={onClose}>
        <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden w-full max-w-4xl max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="p-8 md:p-12 overflow-y-auto">
                <article>
                    <header className="mb-12">
                        <p className="text-base text-scout-red font-semibold tracking-wide uppercase">{post.category}</p>
                        <h1 className="text-4xl md:text-5xl font-extrabold text-scout-green dark:text-white tracking-tight my-4">{post.title}</h1>
                        <p className="text-lg text-gray-500 dark:text-gray-400">Published on {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </header>
                    <img src={post.imageUrl} alt={post.title} className="w-full h-auto max-h-[450px] object-cover rounded-2xl shadow-lg mb-12" />
                    <div className="prose prose-lg max-w-none dark:prose-invert leading-relaxed">
                       {post.content.split('\n').map((paragraph, index) => (
                           <p key={index} className="text-gray-600 dark:text-gray-400">{paragraph}</p>
                       ))}
                    </div>
                </article>
            </div>
             <div className="text-center p-4 bg-white dark:bg-gray-900 border-t dark:border-gray-700 mt-auto">
                 <button onClick={onClose} className="inline-block font-bold py-2 px-8 rounded-full text-lg transition-colors duration-300 border-2 border-scout-green text-scout-green hover:bg-scout-green hover:text-white dark:text-gray-200 dark:border-gray-500 dark:hover:bg-gray-700 dark:hover:border-gray-700">
                    Close
                </button>
            </div>
        </div>
    </div>
  );
};


const BlogPage: React.FC = () => {
  const { blogPosts, deleteBlogPost } = useData();
  const { isAdmin } = useAuth();
  const { showNotification } = useNotification();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);

  return (
    <div className="bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-scout-green dark:text-white tracking-tight">News & Updates</h1>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-600 dark:text-gray-400">
            Stay up to date with our latest activities, achievements, and stories from the field.
          </p>
           {isAdmin && (
            <button onClick={() => setIsModalOpen(true)} className="mt-6 bg-scout-green text-white font-bold py-3 px-6 rounded-full text-lg hover:bg-opacity-90 transition-transform transform hover:scale-105 duration-300">
              + Add New Post
            </button>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {blogPosts.map((post) => (
            <div key={post.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden flex flex-col group">
              <div className="relative overflow-hidden">
                <img className="w-full h-56 object-cover transform group-hover:scale-110 transition-transform duration-500 ease-in-out" src={post.imageUrl} alt={post.title} />
                 {isAdmin && (
                    <div className="absolute top-2 right-2 z-20 flex space-x-2">
                        <button
                            onClick={(e) => { e.stopPropagation(); setEditingPost(post); }}
                            className="bg-scout-blue text-white rounded-full p-2 leading-none hover:bg-blue-700 transition-colors"
                            aria-label="Edit post"
                            title="Edit post"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V12h2.293l6.5-6.5z"/>
                            </svg>
                        </button>
                        <button 
                            onClick={(e) => {
                                e.stopPropagation();
                                if (window.confirm(`Are you sure you want to delete the post "${post.title}"?`)) {
                                    deleteBlogPost(post.id);
                                    showNotification('Blog post deleted successfully!');
                                }
                            }}
                            className="bg-red-600 text-white rounded-full p-2 leading-none hover:bg-red-700 transition-colors"
                            aria-label="Delete post"
                            title="Delete post"
                        >
                           <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                              <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                              <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                            </svg>
                        </button>
                    </div>
                )}
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <p className="text-sm text-scout-red font-semibold uppercase">{post.category}</p>
                <h3 className="text-xl font-bold mt-2 text-gray-800 dark:text-gray-200 group-hover:text-scout-green dark:group-hover:text-white transition-colors duration-300">{post.title}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 mb-3">{new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed flex-grow">{post.excerpt}</p>
                <button 
                    onClick={() => setSelectedPost(post)}
                    className="mt-4 font-semibold text-scout-green dark:text-white self-start group-hover:underline focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-scout-green rounded"
                    aria-label={`Read more about ${post.title}`}
                >
                  Read More &rarr;
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      {isModalOpen && <AddBlogModal onClose={() => setIsModalOpen(false)} />}
      {editingPost && <EditBlogModal post={editingPost} onClose={() => setEditingPost(null)} />}
      {selectedPost && <BlogDetailModal post={selectedPost} onClose={() => setSelectedPost(null)} />}
    </div>
  );
};

export default BlogPage;
