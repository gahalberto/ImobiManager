import { Request, Response } from "express";
import { propertySchema } from "../schemas/property";
import { createProperty } from "../services/property";
import { uploudPhotos } from "../services/photo";
import { AppDataSource } from "../data-source";
import { Property } from "../infrastructure/entity/Property";

// Controller para a rota de criação de propriedades
export const Create = async (req: Request, res: Response): Promise<any> => {
  // Recebe os dados do body e Realiza a validação dos dados enviados cm ZOD
  console.log(req.body);

  // Validação dos dados enviados pelo ZOD
  const safeData = propertySchema.safeParse(req.body);
  if (!safeData.success) {
    return res.status(400).json({ error: safeData.error });
  }

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

  // Retorna a nova propriedade criada
  res.status(201).json(newProperty);
};
export const filterProperties = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { price_min, price_max, bedrooms, bathrooms, address_city } = req.query;

  try {
    const propertyRepository = AppDataSource.getRepository(Property);

    // Criando a consulta com QueryBuilder
    const queryBuilder = propertyRepository.createQueryBuilder("property");

    // Filtro de preço
    if (price_min) {
      queryBuilder.andWhere("property.price >= :price_min", {
        price_min: parseFloat(price_min as string),
      });
    }
    if (price_max) {
      queryBuilder.andWhere("property.price <= :price_max", {
        price_max: parseFloat(price_max as string),
      });
    }

    // Filtro de número de quartos
    if (bedrooms) {
      queryBuilder.andWhere("property.bedrooms = :bedrooms", {
        bedrooms: parseInt(bedrooms as string),
      });
    }

    // Filtro de número de banheiros
    if (bathrooms) {
      queryBuilder.andWhere("property.bathrooms = :bathrooms", {
        bathrooms: parseInt(bathrooms as string),
      });
    }

    // Filtro de localização (cidade) - Usando ILIKE para buscar sem sensibilidade a maiúsculas/minúsculas
    if (address_city) {
      console.log(address_city);
      queryBuilder.andWhere("property.address_city LIKE :address_city", {
        address_city: `%${address_city}%`,
      });
    }

    // Executar a consulta
    const properties = await queryBuilder.getMany();

    // Retornar as propriedades filtradas
    return res.status(200).json(properties);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "Erro ao filtrar propriedades", message: error });
  }
};
