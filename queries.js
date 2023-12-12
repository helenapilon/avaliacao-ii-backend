const Pool = require("pg").Pool;
const pool = new Pool({
  user: "postgres",
  host: "db.qihxqfysuzlrstbyrbse.supabase.co",
  database: "postgres",
  password: "dawiibackend20232",
  port: 5432,
});

const getUsers = async (request, response) => {
  const { name } = request.query;

  pool.query(
    "SELECT id, name, email FROM users WHERE name ilike '%" +
      name +
      "%' ORDER BY id ASC",
    (error, results) => {
      if (error) {
        console.log(error);
        return response.status(500).send({ message: error.message });
      }

      return response.status(200).json(results.rows);
    }
  );
};

const getUserById = (request, response) => {
  const id = parseInt(request.params.id);

  pool.query(
    "SELECT id, name, email, password, role_id FROM users WHERE id = $1",
    [id],
    (error, results) => {
      if (error) {
        console.log(error);
        return response.status(500).send({ message: error.message });
      }
      return response.status(200).json(results.rows[0]);
    }
  );
};

const login = (request, response) => {
  const { email, password } = request.body;

  pool.query(
    "SELECT id, name, email, role_id from users WHERE email = $1 AND password = $2",
    [email, password],
    (error, result) => {
      if (error) {
        console.log(error);
        response.status(500).send({ message: error.message });
      }
      if (result?.rows?.length == 0) {
        return response.status(500).send({ message: "Usuário não encontrado" });
      } else if (!!result?.rows && result?.rows?.length === 1) {
        return response.status(201).send(result.rows[0]);
      }
    }
  );
};

const createUser = (request, response) => {
  const { name, email, password } = request.body;

  pool.query(
    'INSERT INTO users (name, email, password, role, "inserted_at", "updated_at") VALUES ($1, $2, $3, $4, now(), now()) RETURNING *',
    [name, email, password, role],
    (error, results) => {
      if (error) {
        return response.status(500).send({ message: error.message });
      }
      return response.status(201).send(results.rows[0]);
    }
  );
};

const updateUser = (request, response) => {
  const id = parseInt(request.params.id);
  const { name, email, role } = request.body;

  pool.query(
    'UPDATE users SET name = $1, email = $2, role=$3 "updated_at" = now() WHERE id = $4',
    [name, email, role, id],
    (error, results) => {
      if (error) {
        return response.status(500).send({ message: error.message });
      }
      return response.status(200).send(results.rows[0]);
    }
  );
};
const deleteUser = (request, response) => {
  const id = parseInt(request.params.id);

  pool.query("DELETE FROM users WHERE id = $1", [id], (error, results) => {
    if (error) {
      return response.status(500).send({ message: error.message });
    }
    return response.status(200).send(results.rows[0]);
  });
};

const getLogs = (request, response) => {
  const { description } = request.query;

  pool.query(
    `SELECT log.id, action, description, origin, user_id, users.name as user_name FROM log LEFT JOIN users ON user_id = users.id ${
      "WHERE description ilike '%" + description + "%'"
    } ORDER BY id ASC`,
    (error, results) => {
      if (error) {
        return response.status(500).send({ message: error.message });
      }
      return response.status(200).json(results.rows);
    }
  );
};

const getLogById = (request, response) => {
  const id = parseInt(request.params.id);

  pool.query("SELECT * FROM log WHERE id = $1", [id], (error, results) => {
    if (error) {
      return response.status(500).send({ message: error.message });
    }
    return response.status(200).json(results.rows[0]);
  });
};

const getLogByUserId = (request, response) => {
  const id = parseInt(request.params.id);

  pool.query("SELECT * FROM log WHERE user_id = $1", [id], (error, results) => {
    if (error) {
      return response.status(500).send({ message: error.message });
    }
    return response.status(200).json(results.rows);
  });
};

const createLog = (request, response) => {
  const { action, description, user_id } = request.body;

  pool.query(
    'INSERT INTO log (action, description, user_id, "created_at") VALUES ($1, $2, $3, now()) RETURNING *',
    [action, description, user_id],
    (error, results) => {
      if (error) {
        return response.status(500).send({ message: error.message });
      }
      return response.status(201).send(results.rows[0]);
    }
  );
};

const deleteLog = (request, response) => {
  const id = parseInt(request.params.id);

  pool.query("DELETE FROM log WHERE id = $1", [id], (error, results) => {
    if (error) {
      return response.status(500).send({ message: error.message });
    }
    return response.status(200).send(results.rows[0]);
  });
};

const getProdutos = (request, response) => {
  const { name } = request.query;
  const filter = !!name ? name : "";

  pool.query(
    `SELECT id, titulo, descricao, preco FROM produto 
    ${
      " WHERE titulo ilike '%" + filter + "%'"
      //  +  AND produto.id != " + 2
    } ORDER BY id ASC`,

    (error, results) => {
      if (error) {
        console.log(error);
        return response.status(500).send({ message: error.message });
      }
      return response.status(200).json(results.rows);
    }
  );
};

const getProdutoById = (request, response) => {
  const id = parseInt(request.params.id);

  pool.query("SELECT * FROM produto WHERE id = $1", [id], (error, results) => {
    if (error) {
      return response.status(500).send({ message: error.message });
    }
    return response.status(200).json(results.rows[0]);
  });
};
const getProdutoByLojaId = (request, response) => {
  const id = parseInt(request.params.id);

  pool.query(
    "SELECT * FROM produto WHERE lojaId = $1",
    [id],
    (error, results) => {
      if (error) {
        return response.status(500).send({ message: error.message });
      }
      return response.status(200).json(results.rows);
    }
  );
};
const createProduto = (request, response) => {
  const { titulo, descricao, preco, lojaId } = request.body;

  pool.query(
    "INSERT INTO produto (titulo, descricao, preco, lojaId, 'createdAt', 'updatedAt') VALUES ($1, $2, $3, $4, now(), now()) RETURNING *",
    [titulo, descricao, preco, lojaId],
    (error, results) => {
      if (error) {
        return response.status(500).send({ message: error.message });
      }
      if (results.rows.length > 0) {
        return response.status(201).send(results.rows[0]);
      } else
        return response.status(400).send({ message: "Não foi possível criar" });
    }
  );
};
const updateProduto = (request, response) => {
  const id = parseInt(request.params.id);
  const { titulo, descricao, preco, lojaId } = request.body;
  pool.query(
    `UPDATE produto SET titulo = $1, descricao = $2, preco = $3, lojaId = $4, "updatedAt" = now() WHERE id = 5`,
    [titulo, descricao, preco, lojaId, id],
    (error, results) => {
      if (error) {
        return response.status(500).send({ message: error.message });
      }
      return response.status(200).send(results.rows[0]);
    }
  );
};
const deleteProduto = (request, response) => {
  const id = parseInt(request.params.id);

  pool.query("DELETE FROM produto WHERE id = $1", [id], (error, results) => {
    if (error) {
      return response.status(500).send({ message: error.message });
    }
    return response.status(200).send(results.rows[0]);
  });
};

const getLojas = (request, response) => {
  const { name } = request.query;

  pool.query(
    `SELECT nome, endereco, email, descricao, foto FROM loja 
    ${" WHERE nome ilike '%" + name + "%'"} ORDER BY id ASC`,

    (error, results) => {
      if (error) {
        console.log(error);
        return response.status(500).send({ message: error.message });
      }
      return response.status(200).json(results.rows);
    }
  );
};

const getLojaById = (request, response) => {
  const id = parseInt(request.params.id);

  pool.query("SELECT * FROM loja WHERE id = $1", [id], (error, results) => {
    if (error) {
      return response.status(500).send({ message: error.message });
    }
    return response.status(200).json(results.rows[0]);
  });
};

const createLoja = (request, response) => {
  const { nome, foto, endereco, descricao, email, senha } = request.body;

  pool.query(
    "INSERT INTO loja (nome, foto, endereco, descricao, email, senha, 'createdAt', 'updatedAt') VALUES ($1, $2, $3, $4, $5, $6, now(), now()) RETURNING *",
    [nome, foto, endereco, descricao, email, senha],
    (error, results) => {
      if (error) {
        return response.status(500).send({ message: error.message });
      }
      if (results.rows.length > 0) {
        return response.status(201).send(results.rows[0]);
      } else
        return response.status(400).send({ message: "Não foi possível criar" });
    }
  );
};
const updateLoja = (request, response) => {
  const id = parseInt(request.params.id);
  const { nome, foto, endereco, descricao, email, senha } = request.body;
  pool.query(
    `UPDATE loja SET nome = $1, foto = $2, endereco = $3, descricao = $4 , email = $5,senha = $6, "updatedAt" = now()  WHERE id = $7`,
    [nome, foto, endereco, descricao, email, senha, id],
    (error, results) => {
      if (error) {
        return response.status(500).send({ message: error.message });
      }
      return response.status(200).send(results.rows[0]);
    }
  );
};
const deleteLoja = (request, response) => {
  const id = parseInt(request.params.id);

  pool.query("DELETE FROM loja WHERE id = $1", [id], (error, results) => {
    if (error) {
      return response.status(500).send({ message: error.message });
    }
    return response.status(200).send(results.rows[0]);
  });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  login,
  getLogs,
  getLogById,
  getLogByUserId,
  createLog,
  deleteLog,
  getLojas,
  getLojaById,
  createLoja,
  updateLoja,
  deleteLoja,
  getProdutos,
  getProdutoById,
  getProdutoByLojaId,
  createProduto,
  updateProduto,
  deleteProduto,
};
