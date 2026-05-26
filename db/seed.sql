-- Ejecuta esto en phpMyAdmin (hPanel) sobre la base de datos de prueba.
CREATE TABLE IF NOT EXISTS prueba (
  id INT AUTO_INCREMENT PRIMARY KEY,
  mensaje VARCHAR(255) NOT NULL
);

INSERT INTO prueba (mensaje) VALUES
  ('Hola desde MySQL'),
  ('VerticeQR funciona');
