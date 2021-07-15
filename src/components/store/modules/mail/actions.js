export default {
  async addMail(context, payload) {
    const mailData = {
      from: payload.from,
      to: payload.to,
      subject: payload.subject,
      body: payload.body,
      draft: payload.draft,
      read: payload.read,
      subDelete: payload.subDelete,
      delete: payload.delete,
    };

    const response = await fetch(
      `https://femail-b0318-default-rtdb.firebaseio.com/Mails.json`,
      {
        method: "POST",
        body: JSON.stringify(mailData),
      }
    );
    const newResponse = await response.json();

    if (!response.ok) {
      const error = new Error(
        newResponse.error.message || "Failed to add mail"
      );
      throw error;
    }
    if (newResponse.draft === false) {
      context.commit("addInbox", {
        from: newResponse.from,
        to: newResponse.to,
        subject: newResponse.subject,
        body: newResponse.body,
        draft: newResponse.draft,
        read: newResponse.read,
        subDelete: newResponse.subDelete,
        delete: newResponse.delete,
      });
    } else {
      context.commit("addDraft", {
        from: newResponse.from,
        to: newResponse.to,
        subject: newResponse.subject,
        body: newResponse.body,
        draft: newResponse.draft,
        read: newResponse.read,
        subDelete: newResponse.subDelete,
        delete: newResponse.delete,
      });
    }
  },

  async loadMail(context) {
    await context.dispatch("user/findUser", null, { root: true });
    await context.dispatch("user/loadUsers", null, { root: true });

    const loggedInUser = context.rootGetters["user/loggedInUser"];
    const allUsers = context.rootGetters["user/allUsers"];

    let userData;

    for (const key in allUsers) {
      if (loggedInUser === allUsers[key].email) userData = allUsers[key].id;
    }

    const response = await fetch(
      `https://femail-b0318-default-rtdb.firebaseio.com/Mails.json`
    );
    let responseData = [];
    responseData = await response.json();
    if (!response.ok) {
      const error = new Error(responseData.message || "Failed to fetch!");
      throw error;
    }

    const inbox = [];
    const draft = [];
    const unread = [];
    const deleted = [];
    for (const key in responseData) {
      let verify = false;
      let permDelete = false;

      responseData[key].delete.forEach((recepient) => {
        for (const ind in recepient) {
          if (userData === ind && recepient[ind] === true) {
            permDelete = true;
          }
        }
      });

      responseData[key].subDelete.forEach((recepient) => {
        for (const val in recepient) {
          if (!permDelete && userData === val && recepient[val] === true) {
            verify = true;

            const mail = {
              id: key,
              to: responseData[key].to,
              from: responseData[key].from,
              subject: responseData[key].subject,
              body: responseData[key].body,
              draft: responseData[key].draft,
              read: responseData[key].read,
              subDelete: responseData[key].subDelete,
              delete: responseData[key].delete,
            };
            deleted.unshift(mail);
          }
        }
      });

      if (!verify && !permDelete && responseData[key].draft === false) {
        const mail = {
          id: key,
          to: responseData[key].to,
          from: responseData[key].from,
          subject: responseData[key].subject,
          body: responseData[key].body,
          draft: responseData[key].draft,
          read: responseData[key].read,
          subDelete: responseData[key].subDelete,
          delete: responseData[key].delete,
        };
        inbox.unshift(mail);
      }
      else if(!verify && !permDelete && responseData[key].draft === true) {
        const mail = {
          id: key,
          to: responseData[key].to,
          from: responseData[key].from,
          subject: responseData[key].subject,
          body: responseData[key].body,
          draft: responseData[key].draft,
          read: responseData[key].read,
          subDelete: responseData[key].subDelete,
          delete: responseData[key].delete,
        };

        draft.unshift(mail);
      }
    }

    context.commit("setInbox", inbox);
    context.commit("setDraft", draft);
    context.commit("setUnread", unread);
    context.commit("setDeleted", deleted);
  },

  async removeUnread(context, mail) {
    const loggedInUser = context.rootGetters["user/loggedInUser"];
    const allUsers = context.rootGetters["user/allUsers"];

    let userData;

    for (const key in allUsers) {
      if (loggedInUser === allUsers[key].email) userData = allUsers[key].id;
    }

    const mailId = mail.id;

    mail.read.forEach((recepient) => {
      for (const key in recepient) {
        if (userData === key) {
          recepient[key] = true;
        }
      }
    });

    const response = await fetch(
      `https://femail-b0318-default-rtdb.firebaseio.com/Mails/${mailId}.json`,
      {
        method: "PUT",
        body: JSON.stringify(mail),
      }
    );
    const responseData = await response.json();
    if (!response.ok) {
      const error = new Error(responseData.message || "Failed to fetch!");
      throw error;
    }
  },

  async removeDraft(context, mail) {
    const mailId = mail.id;
    await context.dispatch("mail/loadMail", null , {root:true});

    const allDrafts = context.rootGetters["mail/getDraft"];

    for (const key in allDrafts) {
      if (mailId === allDrafts[key].id){
        mail.draft = false

        const response = await fetch(
          `https://femail-b0318-default-rtdb.firebaseio.com/Mails/${mailId}.json`,
          {
            method: "PUT",
            body: JSON.stringify(mail),
          }
        );

        const responseData = await response.json();
        if (!response.ok) {
          const error = new Error(responseData.message || "Failed to fetch!");
          throw error;
        }
      }

    }
  },

  async firstDelete(context, mail) {
    const loggedInUser = context.rootGetters["user/loggedInUser"];
    const allUsers = context.rootGetters["user/allUsers"];

    let userData;

    for (const key in allUsers) {
      if (loggedInUser === allUsers[key].email) userData = allUsers[key].id;
    }

    const mailId = mail.id;

    mail.subDelete.forEach((recepient) => {
      for (const key in recepient) {
        if (userData === key) {
          recepient[key] = true;
        }
      }
    });

    const response = await fetch(
      `https://femail-b0318-default-rtdb.firebaseio.com/Mails/${mailId}.json`,
      {
        method: "PUT",
        body: JSON.stringify(mail),
      }
    );
    const responseData = await response.json();
    if (!response.ok) {
      const error = new Error(responseData.message || "Failed to fetch!");
      throw error;
    }
  },

  async clearBin(context) {
    const loggedInUser = context.rootGetters["user/loggedInUser"];
    const allUsers = context.rootGetters["user/allUsers"];

    let userData;

    for (const key in allUsers) {
      if (loggedInUser === allUsers[key].email) userData = allUsers[key].id;
    }

    let bin = [];
    bin = await context.getters.getDeleted;

    bin.forEach((mail) => {
      const binId = mail.id;
      mail.delete.forEach((recepient) => {
        for (const key in recepient) {
          if (userData === key) {
            recepient[key] = true;
          }
        }
      });

      fetch(
        `https://femail-b0318-default-rtdb.firebaseio.com/Mails/${binId}.json`,
        {
          method: "PUT",
          body: JSON.stringify(mail),
        }
      );
    });
  },

  async removeOne(context, mail) {
    const loggedInUser = context.rootGetters["user/loggedInUser"];
    const allUsers = context.rootGetters["user/allUsers"];

    let userData;

    for (const key in allUsers) {
      if (loggedInUser === allUsers[key].email) userData = allUsers[key].id;
    }

    const mailId = mail.id;

    mail.delete.forEach((recepient) => {
      for (const key in recepient) {
        if (userData === key) {
          recepient[key] = true;
        }
      }
    });

    const response = await fetch(
      `https://femail-b0318-default-rtdb.firebaseio.com/Mails/${mailId}.json`,
      {
        method: "PUT",
        body: JSON.stringify(mail),
      }
    );
    const responseData = await response.json();
    if (!response.ok) {
      const error = new Error(responseData.message || "Failed to fetch!");
      throw error;
    }
  },
};
