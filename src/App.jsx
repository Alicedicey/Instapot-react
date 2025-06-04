import { useState, useRef } from "react";
import "./App.css";

const initialCardData = [
  {
    src: "assets/pexels-kassandre-pedro-8639743 1.png",
    alt: "Val Thoren",
    caption: "Val Thoren",
  },
  {
    src: "assets/pexels-kassandre-pedro-8639743 1 (1).png",
    alt: "Restaurant terrace",
    caption: "Restaurant terrace",
  },
  {
    src: "assets/pexels-kassandre-pedro-8639743 1 (2).png",
    alt: "An outdoor cafe",
    caption: "An outdoor cafe",
  },
  {
    src: "assets/pexels-kassandre-pedro-8639743 1 (3).png",
    alt: "A very long bridge",
    caption: "A very long bridge, over the forest",
  },
  {
    src: "assets/pexels-kassandre-pedro-8639743 1 (4).png",
    alt: "Tunnel with morning light",
    caption: "Tunnel with morning light",
  },
  {
    src: "assets/pexels-kassandre-pedro-8639743 1 (5).png",
    alt: "Mountain house",
    caption: "Mountain house",
  },
];

export default function App() {
  // Profile State
  const [name, setName] = useState("Val Thoren");
  const [title, setTitle] = useState("Photographer");
  const [avatar, setAvatar] = useState("src\assets\pexels-kassandre-pedro-8639743 1.png");
  // Modal visibility state
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isNewPostModalOpen, setNewPostModalOpen] = useState(false);
  const [isImageModalOpen, setImageModalOpen] = useState(false);

  // Card images and likes state
  const [cards, setCards] = useState(
    initialCardData.map((card) => ({ ...card, liked: false }))
  );

  // Image modal preview info
  const [previewImage, setPreviewImage] = useState(null);
  const [previewTitle, setPreviewTitle] = useState("");

  // Form inputs for edit profile modal
  const editNameRef = useRef();
  const editTitleRef = useRef();
  const editAvatarRef = useRef();

  // Form inputs for new post modal
  const newPostTitleRef = useRef();
  const newPostImageRef = useRef();

  // Handle like toggle
  function toggleLike(index) {
    setCards((prevCards) =>
      prevCards.map((card, i) =>
        i === index ? { ...card, liked: !card.liked } : card
      )
    );
  }

  // Open image preview modal
  function openImageModal(card) {
    setPreviewImage(card.src);
    setPreviewTitle(card.caption);
    setImageModalOpen(true);
  }

  // Close image preview modal
  function closeImageModal() {
    setImageModalOpen(false);
    setPreviewImage(null);
    setPreviewTitle("");
  }

  // Open edit profile modal and prefill inputs
  function openEditModal() {
    setEditModalOpen(true);
    setTimeout(() => {
      if (editNameRef.current) editNameRef.current.value = name;
      if (editTitleRef.current) editTitleRef.current.value = title;
      if (editAvatarRef.current) editAvatarRef.current.value = "";
    }, 0);
  }

  // Close edit profile modal
  function closeEditModal() {
    setEditModalOpen(false);
  }

  // Handle edit profile form submit
  function handleEditSubmit(e) {
    e.preventDefault();
    const newName = editNameRef.current.value.trim();
    const newTitle = editTitleRef.current.value.trim();
    const newAvatarFile = editAvatarRef.current.files[0];

    if (newName.length < 2 || newTitle.length < 2) {
      alert("Name and title must be at least 2 characters long.");
      return;
    }

    setName(newName);
    setTitle(newTitle);

    if (newAvatarFile) {
      const reader = new FileReader();
      reader.onload = () => {
        setAvatar(reader.result);
      };
      reader.readAsDataURL(newAvatarFile);
    }

    closeEditModal();
  }

  // Open new post modal
  function openNewPostModal() {
    setNewPostModalOpen(true);
    setTimeout(() => {
      if (newPostTitleRef.current) newPostTitleRef.current.value = "";
      if (newPostImageRef.current) newPostImageRef.current.value = "";
    }, 0);
  }

  // Close new post modal
  function closeNewPostModal() {
    setNewPostModalOpen(false);
  }

  // Handle new post form submit
  function handleNewPostSubmit(e) {
    e.preventDefault();
    const title = newPostTitleRef.current.value.trim();
    const file = newPostImageRef.current.files[0];

    if (!title || !file) {
      alert("Please enter a title and select an image.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const newCard = {
        src: reader.result,
        alt: title,
        caption: title,
        liked: false,
      };
      setCards((prev) => [newCard, ...prev]);
      closeNewPostModal();
    };
    reader.readAsDataURL(file);
  }

  return (
    <div className="app-container">
      <div className={`non-modals ${isEditModalOpen || isNewPostModalOpen || isImageModalOpen ? "blurred" : ""}`}>
        {/* Profile Section */}
        <div className="profile" id="profile">
          <div className="profile-img">
            <img src={avatar} alt="Avatar" />
          </div>
          <div className="details">
            <h1>{name}</h1>
            <p>{title}</p>
          </div>
          <button className="edit" onClick={openEditModal}>
            Edit
          </button>
        </div>

        {/* New Post Button */}
        <div className="post">
          <button onClick={openNewPostModal}>New Post</button>
        </div>

        {/* Image Gallery */}
        <div className="img-container" id="outdoor-img">
          {cards.map((card, index) => (
            <div key={index} className="image-card" onClick={() => openImageModal(card)}>
              <img src={card.src} alt={card.alt} className="image" />
              <p className="img-text">
                {card.caption}
                <span>
                  <img
                    src={card.liked ? "assets/heart.png" : "assets/Union.png"}
                    alt="like-icon"
                    className="like"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleLike(index);
                    }}
                  />
                </span>
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <div className="modal" id="editModal" style={{ display: "flex" }}>
          <form id="editForm" onSubmit={handleEditSubmit} className="modal-content">
            <h2>Edit Profile</h2>

            <label htmlFor="name">Name</label>
            <input id="name" type="text" ref={editNameRef} />

            <label htmlFor="title">Title</label>
            <input id="title" type="text" ref={editTitleRef} />

            <label htmlFor="avatar">Avatar Image</label>
            <input id="avatar" type="file" ref={editAvatarRef} accept="image/*" />

            <div className="modal-buttons">
              <button type="submit">Save</button>
              <button type="button" id="cancelEdit" onClick={closeEditModal}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* New Post Modal */}
      {isNewPostModalOpen && (
        <div className="modal" id="newPostModal" style={{ display: "flex" }}>
          <form id="newPostForm" onSubmit={handleNewPostSubmit} className="modal-content">
            <h2>New Post</h2>

            <label htmlFor="postTitle">Title</label>
            <input id="postTitle" type="text" ref={newPostTitleRef} />

            <label htmlFor="postImage">Image</label>
            <input id="postImage" type="file" ref={newPostImageRef} accept="image/*" />

            <div className="modal-buttons">
              <button type="submit">Post</button>
              <button type="button" id="cancelPost" onClick={closeNewPostModal}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Image Preview Modal */}
      {isImageModalOpen && (
        <div className="modal" id="imageModal" style={{ display: "flex" }}>
          <div className="modal-content image-preview">
            <img id="previewImage" src={previewImage} alt={previewTitle} />
            <p id="previewTitle">{previewTitle}</p>
            <button id="closeImageModal" onClick={closeImageModal}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
