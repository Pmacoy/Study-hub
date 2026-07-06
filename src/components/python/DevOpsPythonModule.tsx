import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

function Code({ code, output }: { code: string; output?: string }) {
  const [copied, setCopied] = useState(false);
  const [show, setShow] = useState(false);
  return (
    <div className="rounded-xl border border-slate-800 overflow-hidden text-[11px]">
      <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800">
        <span className="font-mono text-slate-500">python</span>
        <div className="flex gap-2">
          {output && <button onClick={() => setShow(s => !s)} className="text-amber-400 text-[10px] hover:text-amber-300 font-semibold">{show ? '▼ hide' : '▶ run'}</button>}
          <button onClick={() => { navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 1400); }}
            className="flex items-center gap-1 text-slate-500 hover:text-slate-300">
            {copied ? <Check size={10} className="text-emerald-400" /> : <Copy size={10} />}
          </button>
        </div>
      </div>
      <pre className="p-4 font-mono leading-relaxed overflow-x-auto bg-slate-950">
        {code.split('\n').map((line, i) => (
          <div key={i} className={line.trim().startsWith('#') ? 'text-slate-600' : /^\s*(def |class |import |from |async |await |if |for |with |try |except |return |raise )\b/.test(line) ? 'text-violet-400' : 'text-slate-300'}>{line}</div>
        ))}
      </pre>
      {output && show && (
        <div className="border-t border-slate-800 bg-slate-900/80 px-4 py-3">
          <pre className="font-mono text-amber-300 text-[11px]">{output}</pre>
        </div>
      )}
    </div>
  );
}

export default function DevOpsPythonModule() {
  const [section, setSection] = useState<'testing' | 'requests' | 'cli' | 'cloud'>('testing');

  const views = [
    { id: 'testing' as const, label: '🧪 pytest & Testes' },
    { id: 'requests' as const, label: '🌐 HTTP & requests' },
    { id: 'cli' as const, label: '⌨️ CLI Tools' },
    { id: 'cloud' as const, label: '☁️ Cloud SDKs' },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {views.map(v => (
          <button key={v.id} onClick={() => setSection(v.id)}
            className={`px-4 py-2 rounded-2xl text-[12px] font-semibold transition-all ${section === v.id ? 'bg-amber-500/20 border border-amber-500/40 text-amber-300' : 'border border-slate-800 text-slate-500 hover:text-slate-300'}`}>
            {v.label}
          </button>
        ))}
      </div>

      {section === 'testing' && (
        <div className="space-y-4">
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-[12px] text-slate-400">
            <span className="text-amber-300 font-bold">pytest</span> é o standard da indústria. Menos boilerplate que unittest, melhor output, fixtures poderosas. Essencial para Infrastructure as Code testing.
          </div>
          <Code code={`# calculator.py
def add(a, b): return a + b
def divide(a, b):
    if b == 0:
        raise ValueError("Cannot divide by zero")
    return a / b

# test_calculator.py — pytest descobre testes automáticamente
import pytest
from calculator import add, divide

# Teste básico
def test_add():
    assert add(2, 3) == 5
    assert add(-1, 1) == 0
    assert add(0, 0) == 0

# Parametrize — um teste, múltiplos casos
@pytest.mark.parametrize("a, b, expected", [
    (2, 3, 5),
    (-1, 1, 0),
    (0, 0, 0),
    (100, -50, 50),
])
def test_add_parametrized(a, b, expected):
    assert add(a, b) == expected

# Testar excepções
def test_divide_by_zero():
    with pytest.raises(ValueError, match="Cannot divide"):
        divide(5, 0)

# Fixtures — setup/teardown reutilizável
@pytest.fixture
def db_config():
    config = {"host": "localhost", "port": 5432}
    yield config  # setup
    # teardown aqui (após yield)

def test_db_connect(db_config):
    assert db_config["port"] == 5432`}
            output={`===== test session starts =====
test_calculator.py::test_add PASSED
test_calculator.py::test_add_parametrized[2-3-5] PASSED
test_calculator.py::test_add_parametrized[-1-1-0] PASSED
test_calculator.py::test_divide_by_zero PASSED
===== 6 passed in 0.12s =====`} />
          <Code code={`# Mocking com unittest.mock — evita chamadas reais
from unittest.mock import patch

def get_ec2_count():
    import boto3
    ec2 = boto3.client("ec2")
    response = ec2.describe_instances()
    return len(response["Reservations"])

def test_get_ec2_count():
    mock_response = {"Reservations": [1, 2, 3]}
    with patch("boto3.client") as mock_client:
        mock_client.return_value.describe_instances.return_value = mock_response
        count = get_ec2_count()
        assert count == 3`}
            output={`PASSED — mocked boto3 call, 0 real AWS requests`} />
        </div>
      )}

      {section === 'requests' && (
        <div className="space-y-4">
          <Code code={`import requests

# GET request
response = requests.get(
    "https://jsonplaceholder.typicode.com/posts/1",
    timeout=10
)
response.raise_for_status()   # raises HTTPError para 4xx/5xx
post = response.json()
print(f"Title: {post['title']}")

# POST request
new_post = requests.post(
    "https://jsonplaceholder.typicode.com/posts",
    json={"title": "Deploy Guide", "body": "content"},
    headers={"Content-Type": "application/json"},
    timeout=10
)
print(new_post.status_code)   # 201

# Session — reutiliza conexão, headers comuns
with requests.Session() as session:
    session.headers.update({
        "Authorization": f"Bearer {TOKEN}",
        "Accept": "application/json"
    })
    r1 = session.get("https://api.github.com/user")
    r2 = session.get("https://api.github.com/repos")`}
            output={`Title: sunt aut facere repellat...
201`} />
          <Code code={`# Health check script — útil em CI/CD
import requests
import sys
import time

def wait_for_service(url: str, timeout: int = 60) -> bool:
    """Aguarda serviço estar disponível."""
    deadline = time.time() + timeout
    while time.time() < deadline:
        try:
            r = requests.get(url, timeout=5)
            if r.status_code == 200:
                print(f"✓ {url} is up")
                return True
        except requests.RequestException:
            pass
        print(f"  Waiting... ({url})")
        time.sleep(5)
    return False

services = [
    "http://api:8080/health",
    "http://db:5432",
]
for svc in services:
    if not wait_for_service(svc, timeout=120):
        print(f"✗ {svc} never became available")
        sys.exit(1)`}
            output={`  Waiting... (http://api:8080/health)
✓ http://api:8080/health is up
✓ http://db:5432 is up`} />
        </div>
      )}

      {section === 'cli' && (
        <div className="space-y-4">
          <Code code={`# deploy_tool.py — CLI profissional com argparse
import argparse
import sys
import subprocess

def deploy(args):
    print(f"Deploying {args.image} to {args.env}")
    cmd = ["kubectl", "set", "image", "deployment/app",
           f"app={args.image}", "-n", args.env]
    if args.dry_run:
        print(f"DRY RUN: {' '.join(cmd)}")
        return
    result = subprocess.run(cmd, capture_output=True, text=True)
    if result.returncode != 0:
        print(f"ERROR: {result.stderr}", file=sys.stderr)
        sys.exit(1)
    print(f"✓ Deploy successful")

def main():
    parser = argparse.ArgumentParser(description="DevOps Deployment Tool")
    parser.add_argument("env", choices=["dev", "staging", "prod"])
    parser.add_argument("--image", required=True, help="Docker image:tag")
    parser.add_argument("--replicas", type=int, default=2)
    parser.add_argument("--dry-run", action="store_true")
    parser.add_argument("-v", "--verbose", action="store_true")

    args = parser.parse_args()
    deploy(args)

if __name__ == "__main__":
    main()

# Uso:
# python deploy_tool.py prod --image app:v1.2.3 --replicas 3
# python deploy_tool.py dev  --image app:latest --dry-run`}
            output={`Deploying app:v1.2.3 to prod
✓ Deploy successful`} />
        </div>
      )}

      {section === 'cloud' && (
        <div className="space-y-4">
          <Code code={`# boto3 — AWS SDK para Python
import boto3

# ── EC2 ──────────────────────────────────────────
ec2 = boto3.client("ec2", region_name="us-east-1")
response = ec2.describe_instances(
    Filters=[{"Name": "instance-state-name", "Values": ["running"]}]
)
for reservation in response["Reservations"]:
    for instance in reservation["Instances"]:
        name = next(
            (t["Value"] for t in instance.get("Tags", []) if t["Key"] == "Name"),
            "unnamed"
        )
        print(f"{name}: {instance['InstanceId']} ({instance['InstanceType']})")

# ── S3 ───────────────────────────────────────────
s3 = boto3.client("s3")
s3.upload_file(
    "deploy.log", "my-bucket", "deployments/2024/deploy.log",
    ExtraArgs={"ContentType": "text/plain", "ServerSideEncryption": "AES256"}
)
paginator = s3.get_paginator("list_objects_v2")
for page in paginator.paginate(Bucket="my-bucket", Prefix="deployments/"):
    for obj in page.get("Contents", []):
        print(f"  {obj['Key']} ({obj['Size']} bytes)")`}
            output={`web-server-prod: i-0abc123 (t3.medium)
api-server-prod: i-0def456 (t3.large)
  deployments/2024/deploy.log (2048 bytes)`} />
          <Code code={`# azure-sdk — Azure SDK para Python
from azure.identity import DefaultAzureCredential
from azure.mgmt.compute import ComputeManagementClient

credential = DefaultAzureCredential()
compute = ComputeManagementClient(credential, subscription_id)

for vm in compute.virtual_machines.list("rg-dbx-pl-dev"):
    print(f"{vm.name}: {vm.hardware_profile.vm_size}")

# ── Databricks SDK ──────────────────────────────
from databricks.sdk import WorkspaceClient

w = WorkspaceClient()  # usa env vars DATABRICKS_HOST + DATABRICKS_TOKEN
for cluster in w.clusters.list():
    print(f"{cluster.cluster_name}: {cluster.state}")`}
            output={`vmss-dbx-proxy-dev: Standard_B2s
jupyter-cluster: RUNNING`} />
          <div className="p-4 rounded-2xl border border-amber-500/20 bg-amber-500/5 space-y-2">
            <div className="text-[11px] font-black text-amber-400 uppercase tracking-widest">Python em Cenários Cross-Cloud</div>
            {[
              'Script de validação de conectividade Oracle (validate-connectivity.sh → validate_connectivity.py)',
              'Health checker para o HAProxy (:9000/health) com alertas por email/Slack',
              'Exportador Prometheus customizado para métricas do Oracle JDBC',
              'Import automation: import-dev-state.sh → terraform state import via subprocess',
            ].map(s => (
              <div key={s} className="flex items-start gap-2 text-[11px] text-slate-400">
                <span className="text-amber-400 shrink-0">→</span>{s}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
