export function createEditModal(listing) {
  return `
        <div id="edit-modal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div class="bg-brand-body rounded-lg p-6 w-full max-w-xl">
                <h2 class="text-2xl font-semibold text-brand-text mb-4">Edit Listing</h2>
                <form id="edit-form" class="space-y-4">
                    <div>
                        <input type="text" id="edit-title" value="${
                          listing.title
                        }"
                               class="w-full p-3 rounded-lg focus:outline-none focus:border-brand-text"
                               placeholder="Title">
                    </div>
                    
                    <div>
                        <textarea id="edit-description" rows="4"
                                class="w-full p-3 rounded-lg focus:outline-none focus:border-brand-text"
                                placeholder="Description">${
                                  listing.description
                                }</textarea>
                    </div>
                    
                    <div>
                        <input type="text" id="edit-tags" value="${listing.tags.join(
                          ", "
                        )}"
                               class="w-full p-3 rounded-lg focus:outline-none focus:border-brand-text"
                               placeholder="Tags (separated by comma)">
                    </div>
                    
                    <div>
                        <input type="text" id="edit-media" value="${listing.media
                          .map((m) => m.url)
                          .join(", ")}"
                               class="w-full p-3 rounded-lg focus:outline-none focus:border-brand-text"
                               placeholder="Image URLs (separated by comma)">
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
