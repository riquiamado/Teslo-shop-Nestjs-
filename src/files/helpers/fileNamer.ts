/* eslint-disable @typescript-eslint/no-unsafe-function-type */
import { v4 as uuid } from 'uuid';
export const fileNamer = (
  req: Express.Request,
  file: Express.Multer.File,
  callback: Function,
) => {
  if (!file) return callback(new Error('File is empty'), false);
  const fileExtencion = file.mimetype.split('/')[1];
  const fileName = `${uuid()}.${fileExtencion}`;

  callback(null, fileName);
};
