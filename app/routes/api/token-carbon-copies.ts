import { ActionFunction, createCookie } from "remix";
import { getFirebaseAdmin } from "~/helpers/firebase.server";

export const action: ActionFunction = async (args) => {
  switch (args.request.method) {
    case "POST":
      return postAction(args);
    case "DELETE":
      return deleteAction(args);
  }
};

export const postAction: ActionFunction = async ({ request }) => {
  const { auth } = getFirebaseAdmin();
  const token = (await request.json()).token;
  const expiresAt = new Date(Date.now() + 1000 * 60 * 24 * 30);
  const cookieValue = await auth.createSessionCookie(token, {
    expiresIn: expiresAt.getTime() - Date.now(),
  });

  return new Response("", {
    status: 200,
    headers: {
      "set-cookie": await createCookie("summa-token-cc").serialize(
        cookieValue,
        {
          domain: "localhost",
          path: "/",
          httpOnly: true,
          sameSite: "strict",
          expires: expiresAt,
        }
      ),
    },
  });
};

export const deleteAction: ActionFunction = async ({}) => {
  return new Response("", {
    status: 204,
    headers: {
      "set-cookie": await createCookie("summa-token-cc").serialize("", {
        domain: "localhost",
        path: "/",
        httpOnly: true,
        sameSite: "strict",
        expires: new Date(0),
      }),
    },
  });
};
