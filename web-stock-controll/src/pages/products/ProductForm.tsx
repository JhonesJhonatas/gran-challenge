import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { z } from 'zod';
import { productService, IMAGE_BASE_URL } from '../../services/productService';
import { getApiError } from '../../services/api';
import { Toast } from '../../components/Toast';
import { FormError } from '../../components/FormError';
import { useToast } from '../../hooks/useToast';
import type { CreateProductPayload } from '../../types/product';

const CATEGORIES = ['Eletrônicos', 'Alimentos', 'Vestuário', 'Outro'] as const;

const schema = z.object({
  name: z.string().min(1, 'Nome do produto é obrigatório'),
  barcode: z.string().optional(),
  description: z.string().min(1, 'Descrição é obrigatória'),
  stock_quantity: z
    .string()
    .optional()
    .refine((val) => !val || (/^\d+$/.test(val) && parseInt(val, 10) >= 0), {
      message: 'Deve ser um número inteiro não-negativo',
    }),
  category: z.enum(CATEGORIES, {
    error: 'Selecione uma categoria',
  }),
  expiration_date: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

const FIELD_CLASS =
  'w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent';
const LABEL_CLASS = 'block text-sm font-medium text-gray-700 mb-1';

export function ProductForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { toast, showToast, hideToast } = useToast();
  const [imageFile, setImageFile] = useState<File | undefined>();
  const [existingImage, setExistingImage] = useState<string | undefined>();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: standardSchemaResolver(schema) });

  useEffect(() => {
    if (!isEdit || !id) return;
    productService
      .getById(Number(id))
      .then((p) => {
        setExistingImage(p.image);
        reset({
          name: p.name,
          barcode: p.barcode ?? '',
          description: p.description,
          stock_quantity: p.stock_quantity != null ? String(p.stock_quantity) : '',
          category: p.category,
          expiration_date: p.expiration_date ? p.expiration_date.split('T')[0] : '',
        });
      })
      .catch((err: unknown) => showToast(getApiError(err), 'error'));
  }, [id, isEdit, reset, showToast]);

  const onSubmit = async (values: FormValues) => {
    const payload: CreateProductPayload = {
      name: values.name,
      description: values.description,
      category: values.category,
      ...(values.barcode ? { barcode: values.barcode } : {}),
      ...(values.stock_quantity ? { stock_quantity: parseInt(values.stock_quantity, 10) } : {}),
      ...(values.expiration_date ? { expiration_date: values.expiration_date } : {}),
    };

    try {
      if (isEdit) {
        await productService.update(Number(id), payload, imageFile);
        showToast('Produto atualizado com sucesso!', 'success');
      } else {
        await productService.create(payload, imageFile);
        showToast('Produto cadastrado com sucesso!', 'success');
        setTimeout(() => navigate('/products'), 1500);
      }
    } catch (err) {
      showToast(getApiError(err), 'error');
    }
  };

  const imagePreviewUrl = imageFile
    ? URL.createObjectURL(imageFile)
    : existingImage
      ? `${IMAGE_BASE_URL}/${existingImage}`
      : null;

  return (
    <>
      {toast && <Toast {...toast} onClose={hideToast} />}

      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <button
            type="button"
            onClick={() => navigate('/products')}
            className="text-gray-400 hover:text-gray-600 transition-colors text-sm"
          >
            ← Voltar
          </button>
          <h1 className="text-2xl font-semibold text-gray-900">
            {isEdit ? 'Editar Produto' : 'Novo Produto'}
          </h1>
        </div>

        <form
          onSubmit={(e) => void handleSubmit(onSubmit)(e)}
          className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-4"
        >
          <div>
            <label className={LABEL_CLASS}>Nome do Produto *</label>
            <input
              {...register('name')}
              className={FIELD_CLASS}
              placeholder="Ex: Notebook Dell XPS 15"
            />
            <FormError message={errors.name?.message} />
          </div>

          <div>
            <label className={LABEL_CLASS}>Código de Barras</label>
            <input {...register('barcode')} className={FIELD_CLASS} placeholder="Opcional" />
            <FormError message={errors.barcode?.message} />
          </div>

          <div>
            <label className={LABEL_CLASS}>Descrição *</label>
            <textarea
              {...register('description')}
              rows={3}
              className={FIELD_CLASS}
              placeholder="Descrição detalhada do produto"
            />
            <FormError message={errors.description?.message} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={LABEL_CLASS}>Quantidade em Estoque</label>
              <input
                {...register('stock_quantity')}
                type="number"
                min={0}
                className={FIELD_CLASS}
                placeholder="0"
              />
              <FormError message={errors.stock_quantity?.message} />
            </div>

            <div>
              <label className={LABEL_CLASS}>Categoria *</label>
              <select {...register('category')} className={FIELD_CLASS}>
                <option value="">Selecione...</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              <FormError message={errors.category?.message} />
            </div>
          </div>

          <div>
            <label className={LABEL_CLASS}>Data de Validade</label>
            <input {...register('expiration_date')} type="date" className={FIELD_CLASS} />
          </div>

          <div>
            <label className={LABEL_CLASS}>Imagem do Produto</label>
            {imagePreviewUrl && (
              <div className="mb-2">
                <img
                  src={imagePreviewUrl}
                  alt="Preview"
                  className="w-24 h-24 object-cover rounded-lg border border-gray-200"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {imageFile ? 'Nova imagem selecionada' : 'Imagem atual'}
                </p>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0])}
              className="block w-full text-sm text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border file:border-gray-300 file:text-xs file:font-medium file:bg-white file:text-gray-700 hover:file:bg-gray-50"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate('/products')}
              className="px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 text-sm rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {isSubmitting
                ? 'Salvando...'
                : isEdit
                  ? 'Salvar Alterações'
                  : 'Cadastrar Produto'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
