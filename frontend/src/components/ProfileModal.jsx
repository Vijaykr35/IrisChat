import React, { useState, useRef } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { setAuthUser } from '../redux/userSlice.js';
import { FiX, FiUploadCloud, FiCamera } from 'react-icons/fi';

export default function ProfileModal({ isOpen, onClose, darkMode }) {
    const authUser = useSelector(store => store.user.authUser);
    const dispatch = useDispatch();
    const [previewOrigin, setPreviewOrigin] = useState(authUser?.profilePhoto || '');
    const [preview, setPreview] = useState(null);
    const [username, setUsername] = useState(authUser?.username || '');
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef(null);

    if (!isOpen) return null;

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Check size (e.g., max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                toast.error("File size must be less than 5MB");
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async () => {
        if (!preview && username === authUser?.username) return onClose(); // No changes

        try {
            setLoading(true);
            const res = await axios.put(
                `${import.meta.env.VITE_BACKEND_URL}/user/profile`, 
                { 
                    ...(preview && { profilePhoto: preview }), 
                    ...(username !== authUser?.username && { username }) 
                }, 
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            );

            if (res.data.success) {
                toast.success("Profile updated successfully");
                dispatch(setAuthUser(res.data.user));
                onClose();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update profile");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className={`w-full max-w-sm rounded-2xl shadow-2xl p-6 ${darkMode ? 'bg-[#202c33] text-[#e9edef]' : 'bg-white text-[#111b21]'}`}>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold tracking-tight">Update Profile</h2>
                    <button onClick={onClose} className={`p-2 rounded-full transition-colors ${darkMode ? 'hover:bg-[#374248] text-[#aebac1]' : 'hover:bg-[#f0f2f5] text-[#54656f]'}`}>
                        <FiX size={24} />
                    </button>
                </div>

                <div className="flex flex-col items-center gap-6">
                    <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                        <img 
                            src={preview || previewOrigin || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} 
                            alt="Profile" 
                            className="w-32 h-32 rounded-full object-cover border-4 border-[#00a884] shadow-md"
                            onError={(e) => { e.target.src = "https://cdn-icons-png.flaticon.com/512/149/149071.png" }}
                        />
                        <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <FiCamera size={32} className="text-white" />
                        </div>
                    </div>

                    <input 
                        type="file" 
                        accept="image/png, image/jpeg, image/jpg, image/webp" 
                        ref={fileInputRef} 
                        onChange={handleFileChange} 
                        className="hidden" 
                    />

                    <div className="w-full mt-2">
                        <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-[#8696a0]' : 'text-[#667781]'}`}>Username</label>
                        <input 
                            type="text" 
                            value={username} 
                            onChange={(e) => setUsername(e.target.value)} 
                            className={`w-full p-2.5 rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-[#00a884] transition-colors ${darkMode ? 'bg-[#2a3942] text-[#d1d7db]' : 'bg-[#f0f2f5] text-[#111b21]'}`}
                        />
                    </div>

                    <p className={`text-xs text-center ${darkMode ? 'text-[#8696a0]' : 'text-[#667781]'}`}>
                        Max profile upload size: 5MB
                    </p>

                    <div className="flex w-full gap-3 mt-4">
                        <button 
                            onClick={onClose}
                            className={`flex-1 py-2.5 rounded-lg font-medium transition-colors ${darkMode ? 'bg-[#2a3942] hover:bg-[#374248] text-[#d1d7db]' : 'bg-[#f0f2f5] hover:bg-[#e9edef] text-[#54656f]'}`}
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={handleSave}
                            disabled={loading || (!preview && username === authUser?.username)}
                            className={`flex-1 py-2.5 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors ${loading || (!preview && username === authUser?.username) ? 'bg-gray-500 cursor-not-allowed opacity-50' : 'bg-[#00a884] hover:bg-[#008f6f] text-white'}`}
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    <FiUploadCloud size={18} />
                                    Save
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
