/* eslint-disable @typescript-eslint/no-unsafe-function-type */
export const fileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  callback: Function,
) => {
  console.log({ file });
  if (!file) return callback(new Error('File is empty'), false);
  const fileExtencion = file.mimetype.split('/')[1];
  const validExtencion = ['jpg', 'jpeg', 'png', 'gif'];
  if (validExtencion.includes(fileExtencion)) {
    return callback(null, true);
  }
  callback(null, false);
};
