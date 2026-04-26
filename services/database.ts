
import { quotesModule } from './modules/quotes.service';
import { clientsModule } from './modules/clients.service';
import { profileModule } from './modules/profile.service';

// Exporta os serviços individuais consolidados
export const quotesService = quotesModule;
export const clientsService = clientsModule;
export const profileService = profileModule;
