export function createEditProfileModal(profile) {
  return `
        <div id="edit-profile-modal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div class="bg-[#F4F3EE] rounded-lg p-6 w-full max-w-xl">
                <h2 class="text-2xl font-semibold text-brand-text mb-4">Edit Profile</h2>
                <form id="edit-profile-form" class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                        <textarea id="edit-bio" rows="4"
                                class="w-full p-3 rounded-lg focus:outline-none focus:border-brand-text"
                                placeholder="Your bio">${
                                  profile.bio || ""
                                }</textarea>
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Avatar URL</label>
                        <input type="url" id="edit-avatar" 
                               value="${profile.avatar?.url || ""}"
                               class="w-full p-3 rounded-lg focus:outline-none focus:border-brand-text"
                               placeholder="https://example.com/image.jpg">
                    </div>
                    
                    <div class="flex gap-3">
                        <button type="submit"
                                class="flex-1 bg-[#E0AFA0] text-white px-6 py-3 rounded-lg hover:bg-opacity-90 transition-colors">
                            Update
                        </button>
                        <button type="button" id="cancel-edit"
                                class="flex-1 bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-opacity-90 transition-colors">
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `;
}
