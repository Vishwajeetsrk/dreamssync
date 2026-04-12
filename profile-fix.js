const fs = require('fs');
let content = fs.readFileSync('src/app/profile/page.tsx', 'utf8');

// Add Globe
content = content.replace("ShieldCheck, Eye, EyeOff", "ShieldCheck, Eye, EyeOff, Globe");

// Replace handleChangePassword
const oldChangePassword = `  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword) return;
    setLoading(true);
    try {
      await updatePassword(auth.currentUser!, newPassword);
      setMessage({ type: 'success', text: 'Password updated successfully.' });
      setNewPassword('');
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };`;

const newChangePassword = `  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || (!currentPassword && auth.currentUser?.email)) {
      setMessage({ type: 'error', text: 'Please enter both current and new passwords.' });
      return;
    }
    setLoading(true);
    try {
      if (auth.currentUser?.email && currentPassword) {
        const credential = EmailAuthProvider.credential(auth.currentUser.email, currentPassword);
        await reauthenticateWithCredential(auth.currentUser, credential);
      }
      await updatePassword(auth.currentUser!, newPassword);
      setMessage({ type: 'success', text: 'Password updated successfully.' });
      setCurrentPassword('');
      setNewPassword('');
    } catch (err: any) {
      if (err.code === 'auth/invalid-credential') {
        setMessage({ type: 'error', text: 'Incorrect current password.' });
      } else {
        setMessage({ type: 'error', text: err.message });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLinkAccount = async (providerName: 'google' | 'github') => {
    setLoading(true);
    let provider;
    if (providerName === 'google') provider = new GoogleAuthProvider();
    else if (providerName === 'github') provider = new GithubAuthProvider();
    else return;

    try {
      await linkWithPopup(auth.currentUser!, provider);
      setMessage({ type: 'success', text: \`Successfully linked \${providerName} account.\` });
    } catch (err: any) {
      if (err.code === 'auth/credential-already-in-use') {
        setMessage({ type: 'error', text: \`This \${providerName} account is already linked to another user.\` });
      } else {
        setMessage({ type: 'error', text: err.message });
      }
    } finally {
      setLoading(false);
    }
  };`;

content = content.replace(oldChangePassword, newChangePassword);

const oldForms = `<form onSubmit={handleChangePassword} className="space-y-12 max-w-2xl">
                  <div className="space-y-6">
                    <label className="text-xs font-black uppercase tracking-widest text-[#2563EB] flex items-center justify-between">`;

const newForms = `<form onSubmit={handleChangePassword} className="space-y-12 max-w-2xl">
                  <div className="space-y-6">
                    <label className="text-xs font-black uppercase tracking-widest text-[#2563EB] flex items-center justify-between">
                      <span>Current Password</span>
                      <button type="button" onClick={() => setShowCurrentPassword(!showCurrentPassword)} className="text-gray-500 hover:text-black lowercase text-[10px] tracking-normal flex items-center gap-1 font-bold">
                         {showCurrentPassword ? <EyeOff className="w-4 h-4"/> : <Eye className="w-4 h-4"/>}
                         (view the password)
                      </button>
                    </label>
                    <div className="relative">
                      <input 
                        type={showCurrentPassword ? "text" : "password"} 
                        value={currentPassword} 
                        onChange={(e) => setCurrentPassword(e.target.value)} 
                        placeholder="••••••••••••••••••••••••••••••••••••"
                        className="neo-input text-2xl w-full pr-16" 
                      />
                    </div>
                  </div>
                  <div className="space-y-6">
                    <label className="text-xs font-black uppercase tracking-widest text-[#2563EB] flex items-center justify-between">`;

content = content.replace(oldForms, newForms);


const oldDangerZone = `              {/* Termination Zone Architecture */}`;

const linkHtml = `              <div className="neo-box p-16 bg-white space-y-10">
                 <h3 className="text-3xl font-black uppercase tracking-tighter flex items-center gap-6">
                    <Globe className="w-10 h-10 text-[#2563EB]" /> Connected Accounts
                 </h3>
                 <p className="text-sm font-bold text-gray-500">Link your external accounts for easier sign-in. If you created your account with Google/GitHub, you can map it here.</p>
                 <div className="flex gap-4">
                    <button 
                      onClick={() => handleLinkAccount('google')}
                      className="px-8 py-4 bg-white border-4 border-black flex items-center gap-3 font-black text-sm uppercase hover:bg-gray-100 transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                    >
                       Link Google
                    </button>
                    <button 
                      onClick={() => handleLinkAccount('github')}
                      className="px-8 py-4 bg-white border-4 border-black flex items-center gap-3 font-black text-sm uppercase hover:bg-gray-100 transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                    >
                       Link GitHub
                    </button>
                 </div>
              </div>

              {/* Termination Zone Architecture */}`;

content = content.replace(oldDangerZone, linkHtml);

fs.writeFileSync('src/app/profile/page.tsx', content, 'utf8');
