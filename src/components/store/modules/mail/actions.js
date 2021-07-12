export default {
  async addMail(context, payload) {
    // const userId = localStorage.getItem("userId");
    console.log("send payload", payload.read);
    const mailData = {
      from: payload.from,
      to: payload.to,
      subject: payload.subject,
      body: payload.body,
      draft: payload.draft,
      read: payload.read,
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

    console.log("response", response);
    console.log("new response", newResponse);

    if (!response.ok) {
      const error = new Error(
        newResponse.error.message || "Failed to add mail"
      );
      console.log("error", newResponse.error.message);

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
        delete: newResponse.delete,
      });
    }
  },

  async loadMail(context) {
    // const userId = localStorage.getItem("userId");
    const response = await fetch(
      `https://femail-b0318-default-rtdb.firebaseio.com/Mails.json`
    );
    let responseData = [];
    responseData = await response.json();
    console.log("response", responseData);
    if (!response.ok) {
      const error = new Error(responseData.message || "Failed to fetch!");
      throw error;
    }
    //  const user = context.getters.loggedInUser
    //   let myMail = []

    //   console.log('user', user)
    //   for (let i = 0; i < responseData.length; i++) {
    //     responseData[i].to.forEach((person) => {
    //       if (person === user) {
    //         myMail.push(responseData[i]);
    //       }
    //     });
    //           console.log("this mail",myMail);

    //   }
    // for (let i = 0; i < myMail.length; i++) {
    //   if (this.myMail[i].read === false) {
    //     this.unreadMail.push(this.myMail[i]);
    //   }
    // }

    const inbox = [];
    const draft = [];
    const unread = [];
    const deleted = [];
    for (const key in responseData) {
      if (responseData[key].delete === true) {
        const mail = {
          id: key,
          to: responseData[key].to,
          from: responseData[key].from,
          subject: responseData[key].subject,
          body: responseData[key].body,
          draft: responseData[key].draft,
          read: responseData[key].read,
          delete: responseData[key].delete,
        };
        deleted.unshift(mail);
      } else if (responseData[key].draft === false) {
        const mail = {
          id: key,
          to: responseData[key].to,
          from: responseData[key].from,
          subject: responseData[key].subject,
          body: responseData[key].body,
          draft: responseData[key].draft,
          read: responseData[key].read,
          delete: responseData[key].delete,
        };
        inbox.unshift(mail);
      } else {
        const mail = {
          id: key,
          to: responseData[key].to,
          from: responseData[key].from,
          subject: responseData[key].subject,
          body: responseData[key].body,
          draft: responseData[key].draft,
          read: responseData[key].read,
          delete: responseData[key].delete,
        };

        draft.unshift(mail);
      }
    }
    for (let i = 0; i < inbox.length; i++) {
      if (inbox[i].read === false) {
        const mail = {
          id: inbox[i].id,
          to: inbox[i].to,
          from: inbox[i].from,
          subject: inbox[i].subject,
          body: inbox[i].body,
          draft: inbox[i].draft,
          read: inbox[i].read,
          delete: inbox[i].delete,
        };
        unread.unshift(mail);
      }
    }
    console.log("inbox", inbox);
    console.log("deleted", deleted);

    context.commit("setInbox", inbox);
    context.commit("setDraft", draft);
    context.commit("setUnread", unread);
    context.commit("setDeleted", deleted);
  },

  async removeUnread(context, mail) {
    //  const userId = localStorage.getItem("userId");
    await context.dispatch("user/loadUsers", null, { root: true });
    // await context.dispatch("user/findUser",  null, { root: true });
    const loggedInUser = context.getters.loggedInUser;
    const allUsers = context.getters.allUsers;
    console.log('user', loggedInUser)
    console.log('all', allUsers)
    let userData;

    for (const key in allUsers) {
      if (loggedInUser === allUsers[key].email) userData = allUsers[key].id;
      console.log({userData})
    }

    const mailId = mail.id;
    console.log('mail id', mailId)

    mail.read.forEach((recepient) => {
      for (const key in recepient) {
        if (userData === key) {
          recepient[key] === true;
        }
      }
      // if(this.userData === recepient ){
      console.log("key", recepient);

      // }
    });

    // const mailData = {
    //   from: mail.from,
    //   to: mail.to,
    //   subject: mail.subject,
    //   body: mail.body,
    //   draft: mail.draft,
    //   read: true,
    // };

    const response = await fetch(
      `https://femail-b0318-default-rtdb.firebaseio.com/Mails/${mailId}.json`,
      {
        method: "PUT",
        body: JSON.stringify(mail),
      }
    );
    const responseData = await response.json();
    console.log(responseData.read);
    if (!response.ok) {
      const error = new Error(responseData.message || "Failed to fetch!");
      throw error;
    }
  },

  async removeDraft(payload, mail) {
    // const userId = localStorage.getItem("userId");
    const mailId = mail.id;
    console.log("mailid", mailId);

    const mailData = {
      from: mail.from,
      to: mail.to,
      subject: mail.subject,
      body: mail.body,
      draft: false,
      read: mail.read,
    };
    console.log("mail", mail);

    const response = await fetch(
      `https://femail-b0318-default-rtdb.firebaseio.com/Mails/${mailId}.json`,
      {
        method: "PUT",
        body: JSON.stringify(mailData),
      }
    );
    const responseData = await response.json();
    if (!response.ok) {
      const error = new Error(responseData.message || "Failed to fetch!");
      throw error;
    }
  },

  async deleteMail(_, mail) {
    // const userId = localStorage.getItem("userId");
    const mailId = mail.id;

    const mailData = {
      from: mail.from,
      to: mail.to,
      subject: mail.subject,
      body: mail.body,
      draft: mail.draft,
      read: mail.read,
      delete: true,
    };
    console.log("mail", mail);

    const response = await fetch(
      `https://femail-b0318-default-rtdb.firebaseio.com/Mails/${mailId}.json`,
      {
        method: "PUT",
        body: JSON.stringify(mailData),
      }
    );
    const responseData = await response.json();
    console.log(responseData.read);
    if (!response.ok) {
      const error = new Error(responseData.message || "Failed to fetch!");
      throw error;
    }
  },

  async clearBin(context) {
    // const userId = localStorage.getItem("userId");
    let bin = [];
    bin = await context.getters.getDeleted;
    console.log("bin", bin);

    bin.forEach((mail) => {
      const binId = mail.id;
      console.log({ binId });
      console.log("action", mail);

      fetch(
        `https://femail-b0318-default-rtdb.firebaseio.com/Mails/${binId}.json`,
        {
          method: "DELETE",
          body: JSON.stringify(mail),
        }
      );
    });

    //  const response = await fetch(
    //     `https://femail-b0318-default-rtdb.firebaseio.com/Mails/${userId}/${bin}.json`,
    //    {
    //      method: "DELETE",
    //      body: JSON.stringify(mailData),
    //    }
    //  );
    //  const responseData = await response.json();
    //  console.log(responseData.read);
    //  if (!response.ok) {
    //    const error = new Error(responseData.message || "Failed to fetch!");
    //    throw error;
    //  }
  },
};
