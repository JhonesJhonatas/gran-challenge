import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { productService, IMAGE_BASE_URL } from '../../services/productService';
import { getApiError } from '../../services/api';
import { Toast } from '../../components/Toast';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { useToast } from '../../hooks/useToast';
import type { Product } from '../../types/product';

function formatDate(dateStr?: string) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('pt-BR', { timeZone: 'UTC' });
}

export function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const { toast, showToast, hideToast } = useToast();

  const fetchProducts = useCallback(async () => {
    try {
      setProducts(await productService.getAll());
    } catch (err) {
      showToast(getApiError(err), 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => { void fetchProducts(); }, [fetchProducts]);

  const handleDelete = async () => {
    if (deleteId === null) return;
    try {
      await productService.remove(deleteId);
      setProducts((prev) => prev.filter((p) => p.id !== deleteId));
      showToast('Produto excluído com sucesso!', 'success');
    } catch (err) {
      showToast(getApiError(err), 'error');
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <>
      {toast && <Toast {...toast} onClose={hideToast} />}
      {deleteId !== null && (
        <ConfirmDialog
          message="Tem certeza que deseja excluir este produto?"
          onConfirm={() => void handleDelete()}
          onCancel={() => setDeleteId(null)}
        />
      )}

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Produtos</h1>
        <Link
          to="/products/new"
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          + Novo Produto
        </Link>
      </div>

      {loading ? (
        <p className="text-gray-500">Carregando...</p>
      ) : products.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-lg mb-2">Nenhum produto cadastrado.</p>
          <Link to="/products/new" className="text-blue-600 hover:underline text-sm">
            Cadastrar o primeiro produto
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {['Imagem', 'Nome', 'Cód. Barras', 'Categoria', 'Estoque', 'Validade', 'Ações'].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    {product.image ? (
                      <img
                        src={`${IMAGE_BASE_URL}/${product.image}`}
                        alt={product.name}
                        className="w-10 h-10 object-cover rounded-md border border-gray-200"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-md bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-300 text-xs">
                        —
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-900">{product.name}</td>
                  <td className="px-4 py-3 text-gray-600 font-mono text-xs">{product.barcode ?? '—'}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-600">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{product.stock_quantity}</td>
                  <td className="px-4 py-3 text-gray-600">{formatDate(product.expiration_date)}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2 flex-wrap">
                      <Link
                        to={`/products/${product.id}/suppliers`}
                        className="px-3 py-1 text-xs rounded-md border border-blue-200 text-blue-600 hover:bg-blue-50 transition-colors"
                      >
                        Fornecedores
                      </Link>
                      <Link
                        to={`/products/${product.id}/edit`}
                        className="px-3 py-1 text-xs rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        Editar
                      </Link>
                      <button
                        onClick={() => setDeleteId(product.id)}
                        className="px-3 py-1 text-xs rounded-md border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
                      >
                        Excluir
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
