export default  {
    getInbox(state) {
      return state.inbox;
    },
    getDraft(state) {
      return state.draft;
    },
    getUnread(state){
      return state.unread
    },
    getDeleted(state){
      return state.deleted
    }
  }