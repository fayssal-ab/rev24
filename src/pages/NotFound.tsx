import { Link } from 'react-router-dom';
import { useT } from '../hooks/useT';

export default function NotFound() {
  const { t } = useT();
  return (
    <div className="grid min-h-[50vh] place-items-center text-center">
      <div>
        <p className="font-mono text-5xl text-accent">404</p>
        <p className="mt-2 text-muted">{t('common.notFound')}</p>
        <Link to="/" className="btn-primary mt-4">
          {t('nav.home')}
        </Link>
      </div>
    </div>
  );
}
