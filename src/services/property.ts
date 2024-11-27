import { Property } from "../infrastructure/entity/Property";
import { Photos } from "../infrastructure/entity/Photos";
import { photoRepository } from "../infrastructure/repository/photoRepository";
import { propertyRepository } from "../infrastructure/repository/propertyRepository";
import { getCompaniesByIds } from "./company";
import { companyRepository } from "../infrastructure/repository/companyRepository";

type CreatePropertyPropsType = {
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
  company: number;
};

type UpdatePropertyType = {
  id: number;
  title?: string;
  address_zipcode?: string;
  address_street?: string;
  address_number?: number;
  address_complement?: string;
  address_neighborhood?: string;
  address_city?: string;
  address_state?: string;
  price?: number;
  description?: string;
  images?: string[];
  bedrooms?: number;
  bathrooms?: number;
  company?: number;
};

type FilterType = {
  price_min?: number;
  price_max?: number;
  bedrooms?: number;
  bathrooms?: number;
  address_city?: string;
};

// Definindo o tipo para o retorno de getPropertiesByFilter
type FilteredPropertiesResponse = {
  properties: Property[]; // Lista das propriedades filtradas
  totalProperties: number; // Total de propriedades filtradas
};

export const createProperty = async (data: CreatePropertyPropsType) => {
  // Buscar a empresa correspondente ao ID fornecido
  const company = await companyRepository.findOne({
    where: { id: data.company },
  });

  if (!company) {
    throw new Error(`Empresa com ID ${data.company} não encontrada.`);
  }

  const property = await propertyRepository.create({ ...data, company });
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

export const updateProperty = async (data: UpdatePropertyType) => {
  console.log(`ID da propriedade: ${data.id}`);
  const property = await propertyRepository.findOne({
    where: { id: data.id },
    relations: ["company"],
  });

  if (!property) {
    return null;
  }

  // Atualizar os dados da propriedade
  property.title = data.title || property.title;
  property.address_zipcode = data.address_zipcode || property.address_zipcode;
  property.address_street = data.address_street || property.address_street;
  property.address_number = data.address_number || property.address_number;
  property.address_complement =
    data.address_complement || property.address_complement;
  property.address_neighborhood =
    data.address_neighborhood || property.address_neighborhood;
  property.address_city = data.address_city || property.address_city;
  property.address_state = data.address_state || property.address_state;
  property.price = data.price || property.price;
  property.description = data.description || property.description;
  property.bedrooms = data.bedrooms || property.bedrooms;
  property.bathrooms = data.bathrooms || property.bathrooms;
  if (data.company) {
    const company = await companyRepository.findOne({
      where: { id: data.company },
    });
    if (company) {
      property.company = company; // Atribui a empresa encontrada
    } else {
      console.log(`Empresa com ID ${data.company} não encontrada.`);
    }
  }
  // Salvar a propriedade
  await propertyRepository.save(property);
  return property;
};

export const deleteProperty = async (id: number) => {
  // Buscar a propriedade pelo ID
  const property = await propertyRepository.findOne({
    where: { id },
    relations: ["company", "photos"],
  });

  // Se não encontrar a propriedade, retornar null
  if (!property) {
    return null;
  }

  // Remover a propriedade
  await propertyRepository.remove(property);
  return property;
};

export const getPropertyById = async (id: number) => {
  // Buscar a propriedade pelo ID
  const property = await propertyRepository.findOne({
    where: { id },
    relations: ["company", "photos"],
  });

  // Se não encontrar a propriedade, retornar null
  if (!property) {
    return null;
  }

  // Assumindo que você está armazenando as imagens localmente
  if (property.photos && property.photos.length > 0) {
    property.photos.forEach((photo) => {
      photo.filePath = `${photo.filePath}`;
    });
  }

  return property;
};

export const getPropertiesByFilter = async (
  filter: FilterType,
  page: number,
  limit: number
): Promise<FilteredPropertiesResponse> => {
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

  // Filtro de localização (cidade)
  if (filter.address_city) {
    console.log(filter.address_city);
    queryBuilder.andWhere("property.address_city LIKE :address_city", {
      address_city: `%${filter.address_city}%`,
    });
  }

  // Incluir a relação de fotos
  queryBuilder.leftJoinAndSelect("property.photos", "photos");

  // Contagem total de propriedades com filtro
  const totalProperties = await queryBuilder.getCount();

  // Paginação
  queryBuilder.skip((page - 1) * limit).take(limit);

  // Executar a consulta
  const properties = await queryBuilder.getMany();

  // Após a consulta, apenas uma foto por propriedade para a capa no frontend
  properties.forEach((property) => {
    if (property.photos && property.photos.length > 0) {
      // Assumindo que você está armazenando as imagens localmente
      property.photos.forEach((photo) => {
        photo.filePath = `${photo.filePath}`;
      });
    }
  });

  return { properties, totalProperties };
};

export const getTotalPropertiesCount = async () => {
  const totalProperties = await propertyRepository.count(); // Conta todas as propriedades na tabela
  return totalProperties;
};
