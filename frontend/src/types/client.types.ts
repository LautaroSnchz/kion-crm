export interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  status: ClientStatus;
  createdAt: Date;
  updatedAt: Date;
}

export type ClientStatus = "active" | "inactive" | "pending";

export interface CreateClientDto {
  name: string;
  email: string;
  phone?: string;
  company?: string;
}

export interface UpdateClientDto extends Partial<CreateClientDto> {
  status?: ClientStatus;
}