import 'server-only';
import * as jose from 'jose';

export const getInternalApiToken = async (authorization: string | null): Promise<string> => {
  if (!authorization?.startsWith('Bearer ')) {
    throw { message: 'Unauthorized', status: 400 };
  }
  // this is the token containing {token, exp, iat}
  const firebaseToken = authorization.replace('Bearer ', '');
  const { exp } = jose.decodeJwt(firebaseToken);

  console.log(`getInternalApiToken:
    | firebaseToken: ${firebaseToken}
    | exp: ${exp}`);

  const expiredAt = exp || 0;
  if (expiredAt < Date.now() / 1000) {
    console.error('Token expired:', { expiredAt, currentTime: Date.now() / 1000 });
    throw { message: 'Token expired', status: 401 };
  }

  // const { valid } = await verifyToken(firebaseToken);
  // if (!valid) {
  //   throw { message: 'Invalid token', status: 401 };
  // }

  return firebaseToken;
};


// export const getInternalApiToken = async (authorization: string | null): Promise<string> => {
//   if (!authorization?.startsWith('Bearer ')) {
//     throw { message: 'Unauthorized', status: 400 };
//   }
//   // this is the token containing {token, exp, iat}
//   const joseToken = authorization.replace('Bearer ', '');
//   const { token, exp } = jose.decodeJwt(joseToken);
//   const firebaseToken = token as string; // this is the token containing the firebase info
//   const expiredAt = exp || 0;
//   if (expiredAt < Date.now() / 1000) {
//     console.error('Token expired:', { expiredAt, currentTime: Date.now() / 1000 });
//     throw { message: 'Token expired', status: 401 };
//   }
//   // const { valid } = await verifyToken(firebaseToken);
//   // if (!valid) {
//   //   throw { message: 'Invalid token', status: 401 };
//   // }

//   return firebaseToken;
// };
