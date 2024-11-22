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
