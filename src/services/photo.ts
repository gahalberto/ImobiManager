import { Express } from "express";
import { Photos } from "../infrastructure/entity/Photos";
import { photoRepository } from "../infrastructure/repository/photoRepository";

export const uploudPhotos = async (
  files: Express.Multer.File[],
  newProperty: any
) => {
  console.log("Saving photos...");
  const photos = files.map((file) => {
    const photo = new Photos();
    photo.filePath = file.path; // Caminho do arquivo
    photo.property = newProperty; // Associando a imagem à propriedade
    return photo;
  });
  await photoRepository.save(photos);
  console.log("Photos saved successfully");
};
