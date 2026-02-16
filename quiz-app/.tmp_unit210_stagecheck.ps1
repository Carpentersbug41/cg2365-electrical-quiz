$ErrorActionPreference = 'Stop'
$base = 'http://localhost:3000'
function PostJson([string]$stage,[string]$url,[hashtable]$body){
  $json = $body | ConvertTo-Json -Depth 20
  try { return Invoke-RestMethod -Uri $url -Method POST -ContentType 'application/json' -Body $json -TimeoutSec 120 }
  catch { throw "${stage} failed: $($_.Exception.Message)" }
}
$runsCtx = Invoke-RestMethod -Uri "$base/api/admin/module/runs?unit=210" -Method GET -TimeoutSec 30
$versionId = $runsCtx.defaultSyllabusVersionId
$create = PostJson 'CREATE' "$base/api/admin/module/runs" @{ syllabusVersionId = $versionId; unit = '210'; chatTranscript = 'Unit 210 stage timeout check' }
$runId = $create.run.id
$m0Req = @{ syllabusVersionId=$versionId; unit='210'; selectedLos=@('LO1','LO2','LO3'); constraints=@{ minimiseLessons=$false; defaultMaxLessonsPerLO=9; maxAcsPerLesson=4; preferredAcsPerLesson=2; maxLessonsOverrides=@{}; level='Level 2'; audience='beginner'}; orderingPreference='foundation-first'; notes=''; chatTranscript='Unit 210 stage timeout check'; replayFromArtifacts=$false }
$m0 = PostJson 'M0' "$base/api/admin/module/$runId/m0-distill" $m0Req
$m1 = PostJson 'M1' "$base/api/admin/module/$runId/m1-analyze" @{ replayFromArtifacts = $false }
$m2 = PostJson 'M2' "$base/api/admin/module/$runId/m2-coverage" @{ replayFromArtifacts = $false }
$m3 = PostJson 'M3' "$base/api/admin/module/$runId/m3-plan" @{ replayFromArtifacts = $false }
$m4 = PostJson 'M4' "$base/api/admin/module/$runId/m4-blueprints" @{ replayFromArtifacts = $false }
$m5 = PostJson 'M5' "$base/api/admin/module/$runId/m5-validate" @{ replayFromArtifacts = $false }
$summary = Invoke-RestMethod -Uri "$base/api/admin/module/runs/$runId" -Method GET -TimeoutSec 30
$storedM4 = $summary.artifacts | Where-Object { $_.stage -eq 'M4' } | Select-Object -First 1
[ordered]@{ runId=$runId; status='ok'; m4GeneratedBy=($storedM4.artifact_json.loBlueprintSets | ForEach-Object { "$($_.lo):$($_.generatedBy)" }); m5Issues=($m5.artifact.issues | ForEach-Object { "$($_.severity):$($_.code)" }) } | ConvertTo-Json -Depth 10
