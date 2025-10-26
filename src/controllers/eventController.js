const functionService = require('../services/functionService');
const logger = require('../utils/logger');

class EventController {
  /**
   * Criar dados via evento (Azure Function)
   * POST /api/v1/events/create
   * 
   * O BFF envia para a Azure Function via HTTP Trigger
   * A Function recebe o evento e persiste no banco de dados
   */
  async createViaEvent(req, res, next) {
    try {
      const eventData = req.body;
      
      logger.info('Recebendo requisição para criar via evento', {
        eventType: eventData.type,
        data: eventData
      });

      // Validar dados do evento
      if (!eventData.type) {
        const error = new Error('Tipo do evento é obrigatório');
        error.statusCode = 400;
        throw error;
      }

      // Enviar para Azure Function
      const result = await functionService.createViaEvent(eventData);

      logger.info('Evento enviado com sucesso para Azure Function', {
        eventType: eventData.type,
        result
      });

      res.status(201).json({
        success: true,
        message: 'Evento enviado para processamento',
        data: result
      });
    } catch (error) {
      logger.error('Erro ao processar evento', { error: error.message });
      next(error);
    }
  }

  /**
   * Buscar dados processados pela function
   * GET /api/v1/events/data
   */
  async getFunctionData(req, res, next) {
    try {
      logger.info('Buscando dados da Azure Function');

      const data = await functionService.getData(req.query);

      res.json({
        success: true,
        data
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Buscar dados específicos por ID
   * GET /api/v1/events/data/:id
   */
  async getFunctionDataById(req, res, next) {
    try {
      const { id } = req.params;
      logger.info('Buscando dados por ID da Azure Function', { id });

      const data = await functionService.getDataById(id);

      res.json({
        success: true,
        data
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new EventController();