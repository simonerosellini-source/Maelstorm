// API Service for Maelstorm RPG

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3001/api';

class ApiService {
  private token: string | null = null;

  setToken(token: string | null) {
    this.token = token;
  }

  private async request<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<T> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(this.token && { Authorization: `Bearer ${this.token}` }),
      ...options?.headers,
    };

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(error.error || 'Request failed');
    }

    return response.json();
  }

  // Auth
  async register(email: string, password: string, nickname: string) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, nickname }),
    });
  }

  async login(email: string, password: string) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  // Characters
  async createCharacter(data: any) {
    return this.request('/characters/create', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getCharacters() {
    return this.request('/characters/list');
  }

  async getCharacter(id: string) {
    return this.request(`/characters/${id}`);
  }

  async updateCharacter(id: string, data: any) {
    return this.request(`/characters/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteCharacter(id: string) {
    return this.request(`/characters/${id}`, {
      method: 'DELETE',
    });
  }

  // Game Data
  async getRaces() {
    return this.request('/game/races');
  }

  async getClasses() {
    return this.request('/game/classes');
  }

  async getSpells(className?: string) {
    const query = className ? `?class=${className}` : '';
    return this.request(`/game/spells${query}`);
  }

  async getMonsters(cr?: number) {
    const query = cr !== undefined ? `?cr=${cr}` : '';
    return this.request(`/game/monsters${query}`);
  }

  async getItems(type?: string) {
    const query = type ? `?type=${type}` : '';
    return this.request(`/game/items${query}`);
  }
}

export default new ApiService();
