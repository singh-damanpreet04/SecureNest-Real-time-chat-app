import { useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { Image, Send, X } from "lucide-react";
import toast from "react-hot-toast";

const MessageInput = () => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const { sendMessage } = useChatStore();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Check if file is an image
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file (JPEG, PNG, etc.)");
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    const reader = new FileReader();
    
    reader.onload = (event) => {
      setImagePreview(event.target.result);
    };
    
    reader.onerror = (error) => {
      console.error("Error reading file:", error);
      toast.error("Error loading image. Please try another file.");
    };
    
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) return;

    try {
      await sendMessage({
        text: text.trim(),
        image: imagePreview,
      });

      // Clear form
      setText("");
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  return (
    <div className="w-full">
      {imagePreview && (
        <div className="mb-3">
          <div className="relative inline-block">
            <div className="relative group">
              <img
                src={imagePreview}
                alt="Preview"
                className="max-h-40 w-auto max-w-full rounded-lg border-2 border-amber-400 shadow-lg"
                onError={(e) => {
                  console.error("Error loading image preview");
                  e.target.onerror = null;
                  e.target.src = '';
                  toast.error("Failed to load image preview");
                  removeImage();
                }}
              />
              <button
                onClick={removeImage}
                className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 hover:bg-red-600 text-white
                flex items-center justify-center transition-all duration-200 opacity-100 md:opacity-0 group-hover:opacity-100
                focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                type="button"
                aria-label="Remove image"
              >
                <X size={14} />
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .chat-input-area-glass {
          background: rgba(17,24,39,0.95);
          border-radius: 9999px !important;
          border: none;
          box-shadow: 0 0 8px 2px #fffbe6aa, 0 0 12px 3px #ffe06688, 0 0 18px 4px #ff880066, 0 0 24px 6px #ff3d3d44, 0 1px 8px 0 #fff6e022 inset;
          position: relative;
          overflow: hidden;
          padding: 0.25rem 1.25rem;
          transition: box-shadow 0.25s;
        }
        .chat-input-area-glass:focus-within {
          box-shadow: 0 0 0 4px #fffbe6aa, 0 0 16px 4px #ffe06699, 0 0 24px 6px #ff880088, 0 0 32px 8px #ff3d3d66, 0 1px 8px 0 #fff6e022 inset;
        }
        .chat-input-text-glass {
          background: transparent;
          border: none;
          color: #e0e7ef;
          box-shadow: none;
          border-radius: 9999px !important;
          padding-left: 0.5rem;
        }
        .chat-input-text-glass:focus {
          outline: none;
          background: transparent;
          color: #fff;
        }
        .chat-action-btn {
          background: linear-gradient(120deg, #fffbe6 0%, #ffe066 40%, #ff8800 75%, #ff3d3d 100%);
          color: #181f2e;
          border: none;
          box-shadow: 0 2px 8px 0 #ffe06644;
          transition: box-shadow 0.18s, transform 0.18s, background 0.25s;
          outline: none;
        }
        .chat-action-btn:hover,
        .chat-action-btn:focus,
        .chat-action-btn:active {
          box-shadow: 0 0 16px 2px #ffe066cc, 0 0 32px 8px #ff8800cc, 0 2px 24px 0 #ff3d3dcc;
          background: linear-gradient(120deg, #fffbe6 10%, #ffe066 40%, #ff8800 75%, #ff3d3d 100%);
          color: #181f2e;
          transform: scale(1.07) rotate(-2deg);
        }
        .chat-action-btn svg {
          color: #181f2e;
          filter: drop-shadow(0 0 2px #fffbe6cc);
        }
      `}</style>
      <form
        onSubmit={handleSendMessage}
        className="flex items-center gap-2 w-full chat-input-area-glass px-3 py-2 rounded-xl"
      >
        <div className="flex-1 flex gap-2">
          <input
            type="text"
            placeholder="Type a message..."
            className="flex-1 bg-transparent outline-none border-none text-white placeholder:text-gray-400 px-4 py-2 rounded-lg chat-input-text-glass"
            value={text}
            onChange={(e) => setText(e.target.value)}
            autoFocus
          />
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
          />

          <button
            type="button"
            className={`hidden sm:flex btn btn-circle chat-action-btn ${imagePreview ? "text-emerald-500" : "text-zinc-400"}`}
            onClick={() => fileInputRef.current?.click()}
          >
            <Image size={20} />
          </button>
        </div>
        <button
          type="submit"
          className="btn btn-sm btn-circle chat-action-btn"
          disabled={!text.trim() && !imagePreview}
        >
          <Send size={22} />
        </button>
      </form>
    </div>
  );
};
export default MessageInput;