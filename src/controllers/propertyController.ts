import { Request, Response } from "express";
import { propertySchema } from "../schemas/property";
import {
  createProperty,
  deleteProperty,
  getPropertiesByFilter,
  updateProperty,
} from "../services/property";
import { uploudPhotos } from "../services/photo";
import { updatePropertySchema } from "../schemas/updateProperty";

// Controller para a rota de criação de propriedades
export const Create = async (req: Request, res: Response): Promise<any> => {
  // Validação dos dados enviados pelo ZOD
  const safeData = propertySchema.safeParse(req.body);
  if (!safeData.success) {
    return res
      .status(500)
      .json({ error: "Error creating property", message: safeData.error });
  }

  try {
    // Cria a nova propriedade pelo service createProperty
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
    if (!newProperty) {
      return res
        .status(500)
        .json({ error: "Erro ao criar um imóvel ", message: safeData.error });
    }

    // Retorna a nova propriedade criada
    res.status(201).json(newProperty);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: `Erro ao criar um imóvel.` });
  }
};

export const Update = async (req: Request, res: Response): Promise<any> => {
  // Recebe o id da propriedade a ser atualizada
  const { id } = req.params;
  console.log(id);
  // Validação dos dados enviados pelo ZOD
  const safeData = updatePropertySchema.safeParse(req.body);
  if (!safeData.success) {
    return res
      .status(500)
      .json({ error: "Error updating property", message: safeData.error });
  }

  // Tenta atualizar a propriedade pelo service updateProperty
  try {
    const updatedProperty = await updateProperty({
      id: parseInt(id),
      ...safeData.data,
    });

    if (!updatedProperty) {
      return res.status(500).json({
        error: "Erro ao atualizar um imóvel",
        message: safeData.error,
      });
    }

    res.status(200).json(updatedProperty);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: `Erro ao atualizar um imóvel.` });
  }
};

export const Remove = async (req: Request, res: Response): Promise<any> => {
  // Recebe o id da propriedade a ser removida
  const { id } = req.params;

  // Tenta remover a propriedade pelo service deleteProperty
  try {
    const removedProperty = await deleteProperty(parseInt(id));
    res.status(200).json(removedProperty);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: `Erro ao remover um imóvel.` });
  }
};

// Controller para a rota de filtragem de propriedades por query params
export const filterProperties = async (
  req: Request,
  res: Response
): Promise<any> => {
  // Recebe os query params da requisição
  const { price_min, price_max, bedrooms, bathrooms, address_city } = req.query;
  try {
    // Filtra as propriedades pelo service getPropertiesByFilter
    const properties = await getPropertiesByFilter({
      price_min: price_min ? parseInt(price_min as string) : undefined,
      price_max: price_max ? parseFloat(price_max as string) : undefined,
      bedrooms: bedrooms ? parseInt(bedrooms as string) : undefined,
      bathrooms: bathrooms ? parseInt(bathrooms as string) : undefined,
      address_city: address_city as string,
    });
    // Retornar as propriedades filtradas
    return res.status(200).json(properties);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "Erro ao filtrar propriedades", message: error });
  }
};
