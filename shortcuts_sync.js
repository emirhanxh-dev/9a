/**
 * Shortcuts Sync - Persists shortcuts to Supabase
 */
const ShortcutsSync = {
    config: {
        baseUrl: 'https://znrlvhbuzmukznnfxpjy.supabase.co/rest/v1/shortcuts',
        apiKey: 'sb_publishable_VQ6Eu0R0LKEMZOh9P93L0w_qR3Ylyu3'
    },

    async fetchAll() {
        console.log('🔄 Fetching shortcuts from Supabase...');
        try {
            const res = await fetch(this.config.baseUrl, {
                headers: {
                    'apikey': this.config.apiKey,
                    'Authorization': `Bearer ${this.config.apiKey}`
                }
            });
            if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
            const data = await res.json();
            return data.map(item => ({
                id: item.id,
                name: item.name,
                url: item.url
            }));
        } catch (err) {
            console.error('❌ Shortcuts Fetch error:', err);
            return JSON.parse(localStorage.getItem('qsc')) || [];
        }
    },

    async addShortcut(name, url) {
        console.log('📤 Adding shortcut to Supabase:', name);
        try {
            const res = await fetch(this.config.baseUrl, {
                method: 'POST',
                headers: {
                    'apikey': this.config.apiKey,
                    'Authorization': `Bearer ${this.config.apiKey}`,
                    'Content-Type': 'application/json',
                    'Prefer': 'return=representation'
                },
                body: JSON.stringify({ name, url })
            });
            if (!res.ok) throw new Error(`Upload failed: ${res.status}`);
            const result = await res.json();
            return result[0];
        } catch (err) {
            console.error('❌ Add Shortcut error:', err);
            throw err;
        }
    },

    async deleteShortcut(id) {
        console.log('🗑️ Deleting shortcut from Supabase:', id);
        try {
            const res = await fetch(`${this.config.baseUrl}?id=eq.${id}`, {
                method: 'DELETE',
                headers: {
                    'apikey': this.config.apiKey,
                    'Authorization': `Bearer ${this.config.apiKey}`
                }
            });
            if (!res.ok) throw new Error(`Delete failed: ${res.status}`);
            return true;
        } catch (err) {
            console.error('❌ Delete Shortcut error:', err);
            throw err;
        }
    }
};

window.ShortcutsSync = ShortcutsSync;
