/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsEmail, IsIn, IsNotEmpty, IsString, Matches } from 'class-validator';

export class CreateCompanyDto {
  @IsNotEmpty({ message: 'Nome da empresa é obrigatório' })
  @IsString()
  name!: string;

  @IsNotEmpty({ message: 'CNPJ é obrigatório' })
  @Matches(/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/, {
    message: 'CNPJ deve estar no formato 00.000.000/0000-00',
  })
  cnpj!: string;

  @IsNotEmpty({ message: 'Endereço é obrigatório' })
  @IsString()
  address!: string;

  @IsNotEmpty({ message: 'Telefone é obrigatório' })
  @Matches(/^\(\d{2}\)\s\d{4,5}-\d{4}$/, {
    message: 'Telefone deve estar no formato (00) 0000-0000',
  })
  phone_number!: string;

  @IsNotEmpty({ message: 'E-mail é obrigatório' })
  @IsEmail({}, { message: 'E-mail inválido' })
  email!: string;

  @IsNotEmpty({ message: 'Contato principal é obrigatório' })
  @IsIn(['email', 'phone_number'], {
    message: 'Contato principal deve ser email ou phone_number',
  })
  main_contact!: string;
}
