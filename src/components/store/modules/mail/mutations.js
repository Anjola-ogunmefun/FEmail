export default {
  addInbox(state, payload) {
    state.inbox.unshift({
      from: payload.from,
      to: payload.to,
      subject: payload.subject,
      body: payload.body,
      draft: payload.draft,
      read: payload.read,
      subDelete: payload.subDelete,
      delete: payload.delete,
    });
  },
  setInbox(state, payload) {
    state.inbox = payload;
  },
  setDraft(state, payload) {
    state.draft = payload;
  },
  addDraft(state, payload) {
    state.draft.unshift({
      from: payload.from,
      to: payload.to,
      subject: payload.subject,
      body: payload.body,
      subDelete: payload.subDelete,
      delete: payload.delete,
    });
  },
  setUnread(state, payload) {
    state.unread = payload;
  },
setDeleted(state, payload) {
  state.deleted = payload
}
};
