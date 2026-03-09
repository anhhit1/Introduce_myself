/* ============================================
   Chatbot Modal — Open / Close
   ============================================ */
function toggleChat() {
  var modal = document.getElementById('chat-modal');
  if (!modal) return;

  modal.classList.toggle('hidden');
  modal.classList.toggle('flex');

  if (!modal.classList.contains('hidden')) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
}
