const fs = require('fs');
let content = fs.readFileSync('src/app/profile/page.tsx', 'utf8');

const oldUpload = `  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const storageRef = ref(storage, \`avatars/\${user.uid}\`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      setAvatarUrl(url);
      await setDoc(doc(db, 'users', user.uid), { avatar_url: url }, { merge: true });
      setMessage({ type: 'success', text: 'Profile photo updated.' });
    } catch (err: any) {
      console.warn('Storage blocked, fallback sync initiated...');
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = async () => {
        const base64data = reader.result as string;
        try {
          setAvatarUrl(base64data);
          await setDoc(doc(db, 'users', user.uid), { avatar_url: base64data }, { merge: true });
          setMessage({ type: 'success', text: 'Profile photo saved.' });
        } catch (dbErr: any) {
          setMessage({ type: 'error', text: 'Upload failed. File size too large.' });
        } finally {
          setUploading(false);
        }
      };
    } finally {
        // Handled in reader
    }
  };`;

const newUpload = `  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (Firestore limit is 1MB, let's target < 200KB for safety)
    if (file.size > 1024 * 1024) {
      setMessage({ type: 'error', text: 'Image is too large. Please use a file under 1MB.' });
      return;
    }

    setUploading(true);
    
    // We will bypass Firebase Storage to avoid CORS issues and store directly in Firestore as Base64.
    // This is more reliable for avatars in non-production-configured storage buckets.
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = async () => {
      let base64data = reader.result as string;

      // Optional: Simple Canvas Resizing to keep Firestore documents lean
      const img = new Image();
      img.src = base64data;
      img.onload = async () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 400;
        const MAX_HEIGHT = 400;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        const optimizedBase64 = canvas.toDataURL('image/jpeg', 0.8);

        try {
          setAvatarUrl(optimizedBase64);
          await setDoc(doc(db, "users", user.uid), { avatar_url: optimizedBase64 }, { merge: true });
          setMessage({ type: 'success', text: 'Profile photo updated successfully!' });
        } catch (err: any) {
          setMessage({ type: 'error', text: 'Failed to update photo. ' + err.message });
        } finally {
          setUploading(false);
        }
      };
    };
    reader.onerror = () => {
      setMessage({ type: 'error', text: 'Failed to read file.' });
      setUploading(false);
    };
  };`;

content = content.replace(oldUpload, newUpload);
fs.writeFileSync('src/app/profile/page.tsx', content, 'utf8');
