import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { CompanyList } from './pages/companies/CompanyList';
import { CompanyForm } from './pages/companies/CompanyForm';
import { ProductList } from './pages/products/ProductList';
import { ProductForm } from './pages/products/ProductForm';
import { AssociationPage } from './pages/associations/AssociationPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Navigate to="/companies" replace />} />
          <Route path="/companies" element={<CompanyList />} />
          <Route path="/companies/new" element={<CompanyForm />} />
          <Route path="/companies/:id/edit" element={<CompanyForm />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/products/new" element={<ProductForm />} />
          <Route path="/products/:id/edit" element={<ProductForm />} />
          <Route path="/products/:id/suppliers" element={<AssociationPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
