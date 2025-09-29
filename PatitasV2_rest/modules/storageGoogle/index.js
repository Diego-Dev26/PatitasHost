import multer from "multer";
import { Storage } from "@google-cloud/storage";
import express from "express";
import { v4 as uuidv4 } from "uuid";
import serviceAccount from "./patitasauth-457115-8de3b002dcd4.json" with { type: "json" };

// Configuración del cliente de Google Cloud Storage
const storage = new Storage({
  projectId: serviceAccount.project_id,
  credentials: serviceAccount,
});
const bucket = storage.bucket("jardal_bucket");

// Configuración de Multer
const multerStorage = multer.memoryStorage();
const upload = multer({ storage: multerStorage });

const routes = express.Router();

const projectName = process.env.DATABASE_NAME || "general";

routes.post("/upload", upload.array("files"), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).send("No se subieron archivos.");
    }
    const filesPublicData = [];
    for (const file of req.files) {
      const uniqueFileName = `${uuidv4()}-${file.originalname}`; // Modificación aquí
      const filePath = `${projectName}/${uniqueFileName}`;
      const blob = bucket.file(filePath);
      const blobStream = blob.createWriteStream();

      await new Promise((resolve, reject) => {
        blobStream.on("error", (err) => reject(err));
        blobStream.on("finish", () => {
          const publicUrl = `https://storage.googleapis.com/${bucket.name}/${filePath}`;
          filesPublicData.push({
            url: publicUrl,
            _id: uniqueFileName, // Cambiado a uniqueFileName que contiene el UUID y el nombre original
            name: file.originalname, // Se incluye el nombre original del archivo
            type: file.mimetype, // Se incluye el tipo MIME del archivo
          });
          resolve();
        });
        blobStream.end(file.buffer);
      });
    }
    res.status(200).json(filesPublicData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al subir los archivos", error });
  }
});

routes.delete("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params; // El _id se recibe como parámetro de ruta
    if (!id)
      return res
        .status(400)
        .send("No se proporcionó un identificador de archivo válido.");
    const filePath = `${projectName}/${id}`;
    const file = bucket.file(filePath);
    await file.delete();
    res
      .status(200)
      .send({ message: `Archivo con ID: ${id} eliminado correctamente.` });
  } catch (error) {
    console.error(error);
    res.status(200).json({ message: "Error al eliminar el archivo", error });
  }
});

export async function deleteFiles(files) {
  if (!files || files.length === 0) {
    return;
  }

  for (const fileItem of files) {
    const filePath = `${projectName}/${fileItem._id}`;
    const bucketFile = bucket.file(filePath);
    try {
      await bucketFile.delete();
      //console.log(`Foto con ID: ${fileItem._id} eliminada correctamente.`);
    } catch (error) {
      console.error(
        `Error al eliminar la foto con ID: ${JSON.stringify(fileItem)}`,
        error
      );
      // Considera si quieres detener el proceso o continuar con la siguiente foto
    }
  }
}

export default routes;
