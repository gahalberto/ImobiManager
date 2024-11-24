import { Property } from "../infrastructure/entity/Property";
import { Photos } from "../infrastructure/entity/Photos";
import { photoRepository } from "../infrastructure/repository/photoRepository";
import { propertyRepository } from "../infrastructure/repository/propertyRepository";
import { getCompaniesByIds } from "./company";

type PropsType = {
  title: string;
  address_zipcode: string;
  address_street: string;
  address_number: number;
  address_complement?: string;
  address_neighborhood: string;
  address_city: string;
  address_state: string;
  price: number;
  description: string;
  images?: string[];
  bedrooms: number;
  bathrooms: number;
  companies: number[];
};

type FilterType = {
  price_min?: number;
  price_max?: number;
  bedrooms?: number;
  bathrooms?: number;
  address_city?: string;
};

export const createProperty = async (data: PropsType) => {
  // Verifica se as construtoras existem
  const companies = await getCompaniesByIds(data.companies);

  const property = await propertyRepository.create({ ...data, companies });
  await propertyRepository.save(property);
  console.log("Property saved successfully");

  // Enviar as imagens do imóvel
  if (data.images && data.images.length > 0) {
    console.log("Saving photos...");
    const photos = data.images.map((imageUrl) => {
      const photo = new Photos();
      photo.filePath = imageUrl;
      photo.property = property;
      return photo;
    });
    await photoRepository.save(photos);
    console.log("Photos saved successfully");
  }

  console.log("Returning property");
  return property;
};

export const getPropertiesByFilter = async (filter: FilterType) => {
  console.log(filter);
  // Criando a consulta com QueryBuilder
  const queryBuilder = propertyRepository.createQueryBuilder("property");

  // Filtro de preço
  if (filter.price_min) {
    queryBuilder.andWhere("property.price >= :price_min", {
      price_min: filter.price_min,
    });
  }
  // Filtro de preço máximo
  if (filter.price_max) {
    queryBuilder.andWhere("property.price <= :price_max", {
      price_max: Number(filter.price_max),
    });
  }

  // Filtro de número de quartos
  if (filter.bedrooms) {
    queryBuilder.andWhere("property.bedrooms = :bedrooms", {
      bedrooms: filter.bedrooms,
    });
  }

  // Filtro de número de banheiros
  if (filter.bathrooms) {
    queryBuilder.andWhere("property.bathrooms = :bathrooms", {
      bathrooms: filter.bathrooms,
    });
  }

  // Filtro de localização (cidade) - Usando ILIKE para buscar sem sensibilidade a maiúsculas/minúsculas
  if (filter.address_city) {
    console.log(filter.address_city);
    queryBuilder.andWhere("property.address_city LIKE :address_city", {
      address_city: `%${filter.address_city}%`,
    });
  }

  // Executar a consulta
  const properties = await queryBuilder.getMany();
  return properties;
};
