import { Request, Response } from "express";
import { propertySchema } from "../schemas/property";
import { createProperty } from "../services/property";
import { uploudPhotos } from "../services/photo";

// Controller para a rota de criação de propriedades
export const Create = async (req: Request, res: Response): Promise<any> => {
  // Recebe os dados do body e Realiza a validação dos dados enviados cm ZOD
  console.log(req.body);

  const safeData = propertySchema.safeParse(req.body);
  if (!safeData.success) {
    return res.status(400).json({ error: safeData.error });
  }

  const newProperty = await createProperty({
    title: safeData.data.title,
    address_zipcode: safeData.data.address_zipcode,
    address_street: safeData.data.address_street,
    address_number: parseInt(safeData.data.address_number),
    address_complement: safeData.data.address_complement,
    address_neighborhood: safeData.data.address_neighborhood,
    address_city: safeData.data.address_city,
    address_state: safeData.data.address_state,
    price: safeData.data.price,
    description: safeData.data.description,
    images: safeData.data.images,
    bedrooms: safeData.data.bedrooms,
    bathrooms: safeData.data.bathrooms,
    companies: safeData.data.companies,
  });

  // Envia as imagens do imóvel para o service de uploud de imagens
  if (req.files) {
    await uploudPhotos(req.files as Express.Multer.File[], newProperty);
  }

  // Retorna a nova propriedade criada
  res.status(201).json(newProperty);
};
